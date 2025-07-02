const users = [];

function registerUser(username, password) {
    if (users.find(user => user.username === username)) return false;
    users.push({ username, password });
    return true;
}

function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

module.exports = { registerUser, authenticateUser };
