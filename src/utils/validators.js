export const validateUBBEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(alumnos\.ubiobio\.cl|ubiobio\.cl)$/;
    return regex.test(email);
};