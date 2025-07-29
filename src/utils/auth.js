export const parseJwt = (token) => {
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

export const getUserIdFromToken = (token) => {
    const payload = parseJwt(token);
    return payload?.id || payload?.userId || payload?.sub || null;
};

export const getRoleFromToken = (token) => {
    const payload = parseJwt(token);
    if (!payload) return '';
    return (
        payload.role ||
        payload.rol ||
        (Array.isArray(payload.roles)
            ? typeof payload.roles[0] === 'string'
                ? payload.roles[0]
                : payload.roles[0]?.authority
            : null) ||
        (Array.isArray(payload.authorities)
            ? typeof payload.authorities[0] === 'string'
                ? payload.authorities[0]
                : payload.authorities[0]?.authority
            : null) ||
        payload.authority ||
        ''
    );
};
