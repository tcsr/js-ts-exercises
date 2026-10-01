import { EventEmitter } from 'node:events'

const emitter = new EventEmitter();

emitter.on('userCreated', (user: any) => {
    console.log('User Created', user);
})

emitter.emit('userCreated', {
    id: 1,
    name: 'Chandra'
});

// for (let i = 0; i < 3; i++) {
//     setTimeout(() => {
//         console.log(i)
//     }, 100)
// }

// for (var i = 0; i < 3; i++) {
//     setTimeout(() => {
//         console.log(i)
//     }, 100)
// }

const user = {
    id: 1,
    name: 'Chandra',
    greet() {
        console.log(this.name)
    }
}

user.greet();


function greet(city: string) {
    console.log(this.name, city)
}

const fn = greet.bind(user);

fn('Chennai')

// Deep & Shallow Copy

const userObj = {
    id: 1,
    name: "Chandra",
    address: {
        city: "Chennai"
    }
};

let shallow = { ...userObj };

shallow.address.city = "Hyd";
shallow.name = "reddy"
console.log(userObj)

const deep = structuredClone(userObj);
deep.address.city = "Bglr"
console.log(userObj.address.city)