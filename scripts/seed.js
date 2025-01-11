import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Music" },
                { name: "Fitness" },
                { name: "Photography" },
                { name: "Accounting" },
                { name: "Engineering" },
                { name: "Filming" },
            ],
        })
        console.log("Success seeding categories.")
    } catch (error) {
        console.log("Error while seeding database: ", error);
    } finally {
        await db.$disconnect();
    }
}
main();