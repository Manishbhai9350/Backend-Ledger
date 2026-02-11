import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET || 'base-secret-9350');

export const encrypt = (val:string): string => {
    return cryptr.encrypt(val);
}   


export const decrypt = (val:string): string => {
    return cryptr.decrypt(val);
}

