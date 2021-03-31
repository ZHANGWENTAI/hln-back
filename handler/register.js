/*
 * @Author: ZHANGWENTAI
 * @LastEditTime: 2021-03-31 22:41:04
 * @Compile Option: 
 */
`use strict`;

const FabricCAServices = require('fabric-ca-client/lib/FabricCAServices');
const User = require('fabric-common/lib/User');
const SigningIdentity = require('fabric-common/lib/SigningIdentity');
const CryptoSuite_ECDSA_AES = require('fabric-common/lib/impl/CryptoSuite_ECDSA_AES');
const Signer = require('fabric-common/lib/Signer');
const Key = require('fabric-common/lib/Key');
const ECDSA_KEY  = require('fabric-common/lib/impl/ecdsa/key');
const jsrasign = require('jsrsasign');
const logger = require('../util/logger');


async function requestCert(orgName) {
    const fabricCAService = new FabricCAServices('http://localhost:7054');

    let enrollRequest = {
        enrollmentID: 'zwt',
        enrollmentSecret: '240017'
    };
    var certificate, key, publicKey;
    await fabricCAService.enroll(enrollRequest).then(
        (enrollmentStuff) => {
            logger.info(enrollmentStuff);
            certificate = enrollmentStuff.certificate;
            key = enrollmentStuff.key;
            publicKey = enrollmentStuff.key._key.pubKeyHex;
        }, 
        (err) => {logger.error('rejected enroll', err)}
    );

    const registerRequest = {
        enrollmentID: orgName,
        enrollmentSecret: orgName, 
    };
    const registerCfg = 'zwt';
    const user = new User(registerCfg);
    const mspID = 'Org1';
    const cryptoSuite = new CryptoSuite_ECDSA_AES(256, "SHA2");
    const signer = new Signer(cryptoSuite, key);
    const signingIdentity = new SigningIdentity(certificate, publicKey, mspID, cryptoSuite, signer);
    user.setSigningIdentity(signingIdentity);
    await fabricCAService.register(registerRequest, user).then(
        (enrollmentSecret) => {logger.info(enrollmentSecret)}, 
        (err) => {
            logger.error('rejected register: ');
            console.log(err)
        }
    );

    enrollRequest = {
        enrollmentID: orgName,
        enrollmentSecret: orgName
    };
    await fabricCAService.enroll(enrollRequest).then(
        (enrollmentStuff) => {
            logger.info(enrollmentStuff);
        }, 
        (err) => {logger.error('rejected enroll: ', err)}
    );
};


