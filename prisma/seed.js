"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Clean up existing data
    await prisma.record.deleteMany({});
    await prisma.user.deleteMany({});
    const hashedPassword = await bcrypt_1.default.hash('Password123!', 10);
    // Create Users
    const viewer = await prisma.user.create({
        data: {
            email: 'viewer@example.com',
            password: hashedPassword,
            name: 'Viewer User',
            role: 'VIEWER',
            isActive: true,
        },
    });
    const analyst = await prisma.user.create({
        data: {
            email: 'analyst@example.com',
            password: hashedPassword,
            name: 'Analyst User',
            role: 'ANALYST',
            isActive: true,
        },
    });
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            isActive: true,
        },
    });
    console.log('Users created:', { viewer: viewer.email, analyst: analyst.email, admin: admin.email });
    // Create Sample Records
    const categories = ['Food', 'Transport', 'Utilities', 'Salary', 'Entertainment', 'Healthcare', 'Freelance'];
    const recordsInput = [
        // Admin Records
        { amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2024-01-01'), description: 'January Salary', userId: admin.id },
        { amount: 1500, type: 'EXPENSE', category: 'Utilities', date: new Date('2024-01-05'), description: 'Rent and Bills', userId: admin.id },
        { amount: 200, type: 'EXPENSE', category: 'Food', date: new Date('2024-01-10'), description: 'Groceries', userId: admin.id },
        { amount: 100, type: 'EXPENSE', category: 'Transport', date: new Date('2024-01-15'), description: 'Gas', userId: admin.id },
        { amount: 800, type: 'INCOME', category: 'Freelance', date: new Date('2024-01-20'), description: 'Project A', userId: admin.id },
        { amount: 50, type: 'EXPENSE', category: 'Entertainment', date: new Date('2024-01-25'), description: 'Movies', userId: admin.id },
        { amount: 300, type: 'EXPENSE', category: 'Healthcare', date: new Date('2024-02-05'), description: 'Checkup', userId: admin.id },
        // Analyst Records
        { amount: 4500, type: 'INCOME', category: 'Salary', date: new Date('2024-01-01'), description: 'January Salary', userId: analyst.id },
        { amount: 1200, type: 'EXPENSE', category: 'Utilities', date: new Date('2024-01-06'), description: 'Rent', userId: analyst.id },
        { amount: 300, type: 'EXPENSE', category: 'Food', date: new Date('2024-01-12'), description: 'Groceries', userId: analyst.id },
        { amount: 150, type: 'EXPENSE', category: 'Transport', date: new Date('2024-01-18'), description: 'Train Pass', userId: analyst.id },
        { amount: 600, type: 'INCOME', category: 'Freelance', date: new Date('2024-01-22'), description: 'Consulting', userId: analyst.id },
        { amount: 100, type: 'EXPENSE', category: 'Entertainment', date: new Date('2024-02-01'), description: 'Concert', userId: analyst.id },
        { amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2024-02-01'), description: 'February Salary', userId: analyst.id },
        // Viewer Records
        { amount: 4000, type: 'INCOME', category: 'Salary', date: new Date('2024-01-01'), description: 'January Salary', userId: viewer.id },
        { amount: 1000, type: 'EXPENSE', category: 'Utilities', date: new Date('2024-01-07'), description: 'Rent', userId: viewer.id },
        { amount: 250, type: 'EXPENSE', category: 'Food', date: new Date('2024-01-14'), description: 'Groceries', userId: viewer.id },
        { amount: 80, type: 'EXPENSE', category: 'Transport', date: new Date('2024-01-19'), description: 'Bus', userId: viewer.id },
        { amount: 400, type: 'INCOME', category: 'Freelance', date: new Date('2024-01-24'), description: 'Gig Work', userId: viewer.id },
        { amount: 75, type: 'EXPENSE', category: 'Entertainment', date: new Date('2024-02-02'), description: 'Streaming', userId: viewer.id },
        { amount: 4000, type: 'INCOME', category: 'Salary', date: new Date('2024-02-01'), description: 'February Salary', userId: viewer.id },
    ];
    await prisma.record.createMany({
        data: recordsInput,
    });
    console.log('Seeded', recordsInput.length, 'records.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
