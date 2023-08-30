import prisma from '../db';

function obscureEmail (email: string) {
  const [name, domain] = email.split('@');
  const obscuredName = name.slice(0, 2) + '*'.repeat(name.length - 4) + name.slice(-2);
  return `${obscuredName}@${domain}`;
}

async function listAlertees () {
  const alertees = await prisma.alertee.findMany();
  return alertees.map(alertee => ({
    ...alertee,
    email: obscureEmail(alertee.email)
  }));
}

async function addAlertee (email: string) {
  return await prisma.alertee.create({
    data: { email }
  });
}

async function deleteAlertee (id: number) {
  return await prisma.alertee.delete({
    where: { id }
  });
}

export default defineEventHandler(async (event) => {
  if (event.method === 'PUT') {
    const { email } = getQuery(event);

    console.log('email', email);

    if (!email || typeof email !== 'string') {
      return createError({
        message: 'Missing email',
        statusCode: 400
      });
    }

    await addAlertee(email);
    return {
      message: 'Alertee added'
    };
  }

  if (event.method === 'DELETE') {
    const { id: _id } = getQuery(event);
    const id = Number(_id);

    if (!id || typeof id !== 'number' || isNaN(id)) {
      return createError({
        message: 'Missing or invalid id',
        statusCode: 400
      });
    }

    const existingAlertee = await prisma.alertee.findUnique({
      where: { id }
    });

    if (!existingAlertee) {
      return createError({
        message: 'Alertee not found',
        statusCode: 404
      });
    }

    await deleteAlertee(id);

    return {
      message: 'Alertee deleted'
    };
  }

  const alertees = await listAlertees();
  return {
    alertees
  };
});
