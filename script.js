const users = {
    max168: { password: '123456', duration: 60 * 480 * 1000, maxSessions: 10 },  // 8 ชั่วโมง // ห้อง 4
    luck001: { password: '123456', duration: 60 * 60 * 1000, maxSessions: 1 },   // 1 ชัวโมง // มีมี่
    pass899: { password: '899899', duration: 60 * 480 * 1000, maxSessions: 1 },   // 1 ชั่วโมง // ปอน
    admin168: { password: '123456', duration: 60 * 480 * 1000, maxSessions: 10 },   // 8 ชั่วโมง // แจ็ค
    god168: { password: '123456', duration: 60 * 480 * 1000, maxSessions: 10 },   // 8 ชั่วโมง // ซัง
    eqxjdg: { password: 'eqxjdg1999', duration: 60 * 480 * 1000, maxSessions: 10 },   // 8 ชั่วโมง // โต
    admin99: { password: '123456', duration: 60 * 480 * 1000, maxSessions: 10 },   // 8ต ชั่วโมง // พี่น้ำ
    dx: { password: '164626', duration: 60 * 2880 * 1000, maxSessions: 10 }   // ไม่จำกัดเวลา, ไม่จำกัดจำนวนคน
    
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        const sessions = JSON.parse(localStorage.getItem('sessions')) || {};
        const currentTime = new Date().getTime();

        // Remove expired sessions
        Object.keys(sessions).forEach(user => {
            sessions[user] = sessions[user].filter(session => session + users[user].duration > currentTime);
        });

        // Check if max sessions exceeded
        if (sessions[username] && sessions[username].length >= users[username].maxSessions) {
            alert(`ยูสเซอร์ ${username} มีการเข้าสู่ระบบเต็มจำนวนแล้ว`);
            return;
        }

        const loginTime = new Date().getTime();
        const duration = users[username].duration;

        // Add new session
        if (!sessions[username]) sessions[username] = [];
        sessions[username].push(loginTime);

        localStorage.setItem('sessions', JSON.stringify(sessions));
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
    const username = localStorage.getItem('username');
    const loginTime = parseInt(localStorage.getItem('loginTime'), 10);

    const sessions = JSON.parse(localStorage.getItem('sessions')) || {};
    sessions[username] = sessions[username].filter(session => session !== loginTime);

    localStorage.setItem('sessions', JSON.stringify(sessions));
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

// ตัวแปรเพื่อเก็บสถานะการเข้าสู่ระบบสำเร็จสำหรับ submenu8
let isSubmenu8Unlocked = false;

document.getElementById('submenu8-pass').addEventListener('input', function() {
    const password = this.value;
    const errorElement = document.getElementById('password-error');

    if (password.length === 6) {
        if (password === '164626') {
            document.getElementById('submenu8').classList.remove('hidden');
            document.getElementById('submenu8-password').classList.add('hidden');
            isSubmenu8Unlocked = true; // ตั้งสถานะเป็นเข้าระบบสำเร็จ
        } else {
            errorElement.classList.remove('hidden');
            setTimeout(() => {
                errorElement.classList.add('hidden');
                this.value = '';
            }, 2000);
        }
    } else if (password.length > 6) {
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            errorElement.classList.add('hidden');
            this.value = '';
        }, 2000);
    }
});

function showSubMenu(submenuId) {
    document.getElementById('menu').classList.add('hidden');
    document.querySelectorAll('.sub-menu').forEach(submenu => submenu.classList.add('hidden'));

    if (submenuId === 'submenu8') {
        if (isSubmenu8Unlocked) {
            document.getElementById('submenu8').classList.remove('hidden');
        } else {
            document.getElementById('submenu8-password').classList.remove('hidden');
        }
    } else {
        document.getElementById(submenuId).classList.remove('hidden');
    }
}

function backToMenu() {
    document.querySelectorAll('.sub-menu').forEach(submenu => submenu.classList.add('hidden'));
    document.getElementById('menu').classList.remove('hidden');
}
