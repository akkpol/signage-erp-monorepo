import { prisma } from './lib/prisma';

async function testConnection() {
    try {
        console.log('🔍 Testing Supabase connection...');

        // Test 1: Count organizations
        const orgCount = await prisma.organization.count();
        console.log(`✅ Organizations: ${orgCount}`);

        // Test 2: Count customers
        const customerCount = await prisma.customer.count();
        console.log(`✅ Customers: ${customerCount}`);

        // Test 3: Count orders
        const orderCount = await prisma.order.count();
        console.log(`✅ Orders: ${orderCount}`);

        // Test 4: Create a test organization (if none exist)
        if (orgCount === 0) {
            const org = await prisma.organization.create({
                data: {
                    name: 'Akkpol Signage',
                    code: 'AKKPOL'
                }
            });
            console.log(`✅ Created default organization: ${org.id}`);
        }

        console.log('\n🎉 All database tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

testConnection();
