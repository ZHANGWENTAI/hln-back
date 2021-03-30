`use strict`;

const fabricCAServices = require('fabric-ca-client');
const fabricCAClient = new fabricCAServices('http://localhost:7054');

const enrollRequest = {
    enrollmentID: 'zwt',
    enrollmentSecret: '240017'
}

var enrollResponse = fabricCAClient.enroll(enrollRequest).then(
    (enrollment) => {console.log(enrollment)}, 
    () => {console.log('rejected')}
);
