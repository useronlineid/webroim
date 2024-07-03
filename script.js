const users = {
    admin: { password: '123456', duration: 60 * 60 * 1000 },   // 1 นาที
    dx: { password: '164626', duration: 60 * 180 * 1000 } // 60 นาที
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        const loginTime = new Date().getTime();
        const duration = users[username].duration;
        localStorage.setItem('loginTime', loginTime);
        localStorage.setItem('username', username);
        localStorage.setItem('duration', duration);
        document.getElementById('login').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
        updateTimeLeft(); // Update the time left display
        checkSession(); // Start checking the session
    } else {
        alert('รหัสผ่านไม่ถูกต้อง');
    }
}

function showSubMenu(subMenuId) {
    document.getElementById('menu').classList.add('hidden');
    document.querySelectorAll('.sub-menu').forEach(subMenu => {
        subMenu.classList.add('hidden');
    });
    document.getElementById(subMenuId).classList.remove('hidden');
}

function backToMenu() {
    document.getElementById('menu').classList.remove('hidden');
    document.querySelectorAll('.sub-menu').forEach(subMenu => {
        subMenu.classList.add('hidden');
    });
}

function logout() {
    localStorage.removeItem('loginTime');
    localStorage.removeItem('username');
    localStorage.removeItem('duration');
    document.getElementById('menu').classList.add('hidden');
    document.querySelectorAll('.sub-menu').forEach(subMenu => {
        subMenu.classList.add('hidden');
    });
    document.getElementById('login').classList.remove('hidden');
}

function updateTimeLeft() {
    const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
    const duration = parseInt(localStorage.getItem('duration'), 10);
    const currentTime = new Date().getTime();
    const timeLeft = loginTime + duration - currentTime;

    if (timeLeft <= 0) {
        logout();
        alert('กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
    } else {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = ((timeLeft % 60000) / 1000).toFixed(0);
        document.getElementById('time-left').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

function checkSession() {
    updateTimeLeft();
    setInterval(updateTimeLeft, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginTime = localStorage.getItem('loginTime');
    const duration = localStorage.getItem('duration');
    const username = localStorage.getItem('username');

    if (loginTime && duration && username) {
        const currentTime = new Date().getTime();
        if (currentTime < parseInt(loginTime, 10) + parseInt(duration, 10)) {
            document.getElementById('login').classList.add('hidden');
            document.getElementById('menu').classList.remove('hidden');
            checkSession();
        } else {
            logout();
        }
    }
});
