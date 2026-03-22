const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: "mongodb+srv://muhammadyaseen1907_db_user:uDuCMjTQb4kCm7Xb@cluster0.towti3b.mongodb.net/LMS?appName=Cluster0"
});

async function makeAdmin() {
  try {
    const updatedUser = await prisma.user.update({
      where: { email: 'muhammadyaseen1907@gmail.com' },
      data: { role: 'ADMIN', approved: true }
    });
    console.log("Successfully promoted to Admin:", updatedUser.email);
  } catch (error) {
    if (error.code === 'P2025') {
       // User doesn't exist yet, we will create an empty shell that they can log into
       const newUser = await prisma.user.create({
         data: {
           email: 'muhammadyaseen1907@gmail.com',
           name: 'Muhammad Yaseen',
           role: 'ADMIN',
           approved: true
         }
       });
       console.log("Created & promoted new Admin:", newUser.email);
    } else {
       console.error("Error setting admin:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
