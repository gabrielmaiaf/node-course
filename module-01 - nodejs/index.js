/*
  0 - Get an user
  1 - Get user phone from user id
  2 - Get user address from user id
*/

function getUser () {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(function () {
      return resolve({
        id: 1,
        name: 'Aladdin',
        birthDate: new Date()
      })
    }, 1000);
  })
}

function getPhone(idUser) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({
        number: '1199002',
        ddd: 11
      })
    }, 2000);
  })
}

function getAddress(idUser) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({
        street: 'fool ones',
        number: 0
      })
    }, 2000);
  })
}

main()
async function main() {
  try {
    const user = await getUser();
    const result = await Promise.all([
      getPhone(user.id),
      getAddress(user.id)
    ])
    const phone = result[0];
    const address = result[1];

    console.log(`
      Name: ${user.name}
      Telephone: (${phone.ddd}) ${phone.number}
      Address: ${address.street}, ${address.number}
    `)
  } catch(error) {
    console.error('CRASHED!', error);
  }
}