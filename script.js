const allowedIPs = ['38.47.37.8','']; // เพิ่ม IP ที่อนุญาตที่นี่

async function checkIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;

        if (allowedIPs.includes(userIP)) {
            document.getElementById('content').classList.remove('hidden');
        } else {
            document.getElementById('restricted-access').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkIP();

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
        alert('หมดเวลาการใช้งานแล้ว กรุณาเข้าสู่ระบบใหม่');
    } else {
        document.getElementById('time-left').innerText = Math.floor(timeLeft / 1000) + ' วินาที';
    }
}

function checkSession() {
    updateTimeLeft();
    setInterval(updateTimeLeft, 1000); // Update every second
}
