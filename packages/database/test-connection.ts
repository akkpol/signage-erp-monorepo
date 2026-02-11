
import { prisma } from './index'

async function testConnection() {
    console.log('Testing DB connection...')
    try {
        const orgs = await prisma.organization.findMany()
        console.log('Orgs found:', orgs)
    } catch (e) {
        console.error('Test failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
