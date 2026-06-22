#!/bin/bash
# ============================================================
# AGROCASTILLO DATABASE VALIDATION SCRIPT
# ============================================================
# This script validates the AgroCastillo database setup
# Usage: ./validate-db.sh
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DB_HOST=${POSTGRES_HOST:-localhost}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${DB_NAME:-agrocastillo_db}
DB_USER=${DB_USERNAME:-postgres}

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AGROCASTILLO DATABASE VALIDATION                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check command existence
check_command() {
    if command -v $1 &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to run SQL query
run_query() {
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "$1"
}

# Check prerequisites
echo -e "${YELLOW}[1/7] Checking Prerequisites${NC}"
if check_command psql; then
    echo -e "${GREEN}✓${NC} PostgreSQL client installed"
else
    echo -e "${RED}✗${NC} PostgreSQL client not found. Install with: apt-get install postgresql-client"
    exit 1
fi

# Check database connection
echo ""
echo -e "${YELLOW}[2/7] Checking Database Connection${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Connected to $DB_NAME @ $DB_HOST:$DB_PORT"
else
    echo -e "${RED}✗${NC} Cannot connect to database"
    echo "  Connection string: postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
    exit 1
fi

# Check tables
echo ""
echo -e "${YELLOW}[3/7] Checking Tables${NC}"
TABLE_COUNT=$(run_query "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")
echo "  Found $TABLE_COUNT tables:"

EXPECTED_TABLES=("roles" "permisos" "rol_permiso" "ocupaciones" "usuarios" "categorias" "aplicaciones" "aplicacion_categoria" "calificaciones" "favoritos" "hilos_discusion" "comentarios" "reportes")

for table in "${EXPECTED_TABLES[@]}"; do
    EXISTS=$(run_query "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$table'")
    if [ $EXISTS -eq 1 ]; then
        echo -e "    ${GREEN}✓${NC} $table"
    else
        echo -e "    ${RED}✗${NC} $table (MISSING)"
    fi
done

# Check indexes
echo ""
echo -e "${YELLOW}[4/7] Checking Indexes${NC}"
INDEX_COUNT=$(run_query "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'")
echo -e "  Found ${GREEN}$INDEX_COUNT${NC} indexes (expected: 12+)"

# Check constraints
echo ""
echo -e "${YELLOW}[5/7] Checking Constraints${NC}"
FK_COUNT=$(run_query "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'")
UNIQUE_COUNT=$(run_query "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'UNIQUE' AND table_schema = 'public'")
PK_COUNT=$(run_query "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'PRIMARY KEY' AND table_schema = 'public'")

echo "  Primary Keys: $PK_COUNT"
echo "  Foreign Keys: $FK_COUNT"
echo "  Unique Constraints: $UNIQUE_COUNT"

# Check initial data
echo ""
echo -e "${YELLOW}[6/7] Checking Initial Data${NC}"
ROLE_COUNT=$(run_query "SELECT COUNT(*) FROM roles")
PERM_COUNT=$(run_query "SELECT COUNT(*) FROM permisos")
OCC_COUNT=$(run_query "SELECT COUNT(*) FROM ocupaciones")
CAT_COUNT=$(run_query "SELECT COUNT(*) FROM categorias")

echo "  Roles: $ROLE_COUNT (expected: 3)"
echo "  Permissions: $PERM_COUNT (expected: 14)"
echo "  Occupations: $OCC_COUNT (expected: 4)"
echo "  Categories: $CAT_COUNT (expected: 7)"

# Permission mappings
echo ""
echo -e "${YELLOW}[7/7] Checking Role-Permission Mappings${NC}"
USUARIO_PERMS=$(run_query "SELECT COUNT(*) FROM rol_permiso rp JOIN roles r ON rp.id_rol = r.id_rol WHERE r.nombre = 'USUARIO'")
INVESTIGADOR_PERMS=$(run_query "SELECT COUNT(*) FROM rol_permiso rp JOIN roles r ON rp.id_rol = r.id_rol WHERE r.nombre = 'INVESTIGADOR'")
ADMIN_PERMS=$(run_query "SELECT COUNT(*) FROM rol_permiso rp JOIN roles r ON rp.id_rol = r.id_rol WHERE r.nombre = 'ADMIN'")

echo "  USUARIO permissions: $USUARIO_PERMS (expected: 6)"
echo "  INVESTIGADOR permissions: $INVESTIGADOR_PERMS (expected: 10)"
echo "  ADMIN permissions: $ADMIN_PERMS (expected: 14)"

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VALIDATION SUMMARY                                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

# Verify all conditions
SUCCESS=true

if [ $TABLE_COUNT -ne 13 ]; then
    echo -e "${RED}✗ Table count mismatch (expected 13, got $TABLE_COUNT)${NC}"
    SUCCESS=false
else
    echo -e "${GREEN}✓ All 13 tables present${NC}"
fi

if [ $INDEX_COUNT -lt 11 ]; then
    echo -e "${RED}✗ Index count too low (expected 11+, got $INDEX_COUNT)${NC}"
    SUCCESS=false
else
    echo -e "${GREEN}✓ Indexes present (count: $INDEX_COUNT)${NC}"
fi

if [ $ROLE_COUNT -ne 3 ] || [ $PERM_COUNT -ne 14 ] || [ $OCC_COUNT -ne 4 ] || [ $CAT_COUNT -ne 7 ]; then
    echo -e "${RED}✗ Initial data incomplete${NC}"
    SUCCESS=false
else
    echo -e "${GREEN}✓ Initial data complete${NC}"
fi

if [ $ADMIN_PERMS -ne 14 ] || [ $INVESTIGADOR_PERMS -ne 10 ] || [ $USUARIO_PERMS -ne 6 ]; then
    echo -e "${RED}✗ Role-permission mappings incomplete${NC}"
    SUCCESS=false
else
    echo -e "${GREEN}✓ Role-permission mappings correct${NC}"
fi

echo ""

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ DATABASE VALIDATION SUCCESSFUL${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
    echo -e "${RED}✗ DATABASE VALIDATION FAILED${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
    exit 1
fi
