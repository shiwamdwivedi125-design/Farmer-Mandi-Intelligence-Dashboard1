document.addEventListener('DOMContentLoaded', () => {

    /* --- GLOBALS --- */
    let currentLang = 'en';
    let basePriceKanpur = 2300; // Will be updated by API
    
    /* --- TRANSLATION LOGIC --- */
    const translatePage = () => {
        document.querySelectorAll('.trn').forEach(el => {
            const key = el.getAttribute('data-trn');
            if(translations[currentLang][key]) {
                el.innerText = translations[currentLang][key];
            }
        });
    };

    document.getElementById('langToggle').addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        translatePage();
    });

    /* --- API FETCHING (MOCK DEMO) --- */
    const loadDashboardData = async () => {
        try {
            // Fetch Prices
            const priceRes = await fetch('http://localhost:3000/api/prices');
            if(priceRes.ok) {
                const prices = await priceRes.json();
                renderPriceTable(prices);
                
                // Set the base price for the calculator based on Kanpur Wheat
                const kanpurData = prices.find(p => p.mandi === 'Kanpur');
                if(kanpurData) basePriceKanpur = kanpurData.price;
            }

            // Fetch Weather
            const weatherRes = await fetch('http://localhost:3000/api/weather');
            if(weatherRes.ok) {
                const weather = await weatherRes.json();
                document.getElementById('wTemp').innerText = `${weather.temperature}°C`;
                document.getElementById('wLoc').innerText = weather.location;
                document.getElementById('wCond').innerText = weather.condition;
            }

            // Init Chart
            initChart();
        } catch (error) {
            console.error("Dashboard Data Local Fallback due to missing server:", error);
            // Fallback for file:// direct open scenarios
            basePriceKanpur = 2300;
            initChart();
            document.getElementById('priceTableBody').innerHTML = `
                <tr><td>Wheat</td><td>Kanpur</td><td>₹2300</td><td><i class="fa-solid fa-arrow-up trend-up"></i></td></tr>
                <tr><td>Wheat</td><td>Lucknow</td><td>₹2200</td><td><i class="fa-solid fa-arrow-down trend-down"></i></td></tr>
            `;
            document.getElementById('wTemp').innerText = `28°C`;
        }
    };

    const renderPriceTable = (prices) => {
        const tbody = document.getElementById('priceTableBody');
        tbody.innerHTML = '';
        prices.forEach((p, idx) => {
            const tr = document.createElement('tr');
            const trendIcon = idx === 0 ? '<i class="fa-solid fa-arrow-up trend-up"></i>' : '<i class="fa-solid fa-arrow-down trend-down"></i>';
            tr.innerHTML = `
                <td>${p.crop}</td>
                <td>${p.mandi}</td>
                <td>₹${p.price}</td>
                <td>${trendIcon}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    /* --- CHART.JS --- */
    const initChart = () => {
        const ctx = document.getElementById('priceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
                datasets: [{
                    label: 'Kanpur Wheat (₹/Q)',
                    data: [2150, 2180, 2200, 2190, 2250, 2280, basePriceKanpur],
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: false, suggestedMin: 2100 }
                }
            }
        });
    };

    /* --- PROFIT CALCULATOR & ALERTS --- */
    document.getElementById('calculateBtn').addEventListener('click', () => {
        const qty = parseFloat(document.getElementById('calcQty').value) || 0;
        const transport = parseFloat(document.getElementById('calcTransport').value) || 0;
        
        const revenue = qty * basePriceKanpur;
        const profit = revenue - transport;
        
        const profitEl = document.getElementById('profitAmount');
        profitEl.innerText = `₹${profit.toLocaleString('en-IN')}`;
        
        if(profit > 0) {
            profitEl.className = "text-green";
            // Extra profit baseline assumption from the storyline
            // The storyline states: "profit calculator confirms ₹500 extra"
            // For a dramatic demo, assuming the farmer expected 2200/Q, we can show an extra profit msg.
            const extraProfit = qty * (basePriceKanpur - 2200);
            
            showToast(`₹${extraProfit} Extra Profit Expected at Kanpur! Market conditions are favorable.`);
        } else {
            profitEl.className = "text-danger";
        }
    });

    const showToast = (message) => {
        const toast = document.getElementById('alertToast');
        document.getElementById('alertMessage').innerText = message;
        toast.style.display = 'flex';
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.style.display = 'none', 400);
        }, 5000);
    };

    /* --- VOICE SEARCH (WEB SPEECH API) --- */
    const voiceBtn = document.getElementById('voiceBtn');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.lang = 'hi-IN'; // Default to Hindi
        
        recognition.onstart = () => {
            voiceBtn.style.color = '#e74c3c'; // red to indicate listening
            voiceBtn.classList.add('fa-beat');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Voice Input:", transcript);
            showToast(`Voice Query: "${transcript}" -> Searching Kanpur Mandi...`);
        };
        
        recognition.onend = () => {
            voiceBtn.style.color = '';
            voiceBtn.classList.remove('fa-beat');
        };
        
        voiceBtn.addEventListener('click', () => {
            recognition.lang = currentLang === 'en' ? 'en-US' : 'hi-IN';
            recognition.start();
        });
    } else {
        voiceBtn.style.display = 'none'; // Not supported
    }

    /* --- COMMUNITY REPORT --- */
    document.getElementById('reportMandiBtn').addEventListener('click', () => {
        alert("Community Form Modal will appear here for Ramesh to submit crowd levels!");
    });

    /* --- DARK MODE TOGGLE --- */
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        if(currentTheme === "dark") {
            document.documentElement.removeAttribute("data-theme");
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    /* --- AI CHATBOT (HACKATHON FEATURE) --- */
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendChat = document.getElementById('sendChat');
    const chatInput = document.getElementById('chatInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    chatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
    });

    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    sendChat.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if(text) {
            // User message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-msg user-msg';
            userMsg.innerText = text;
            chatbotMessages.appendChild(userMsg);
            chatInput.value = '';

            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Simulated AI Response (Hackathon wow-factor)
            setTimeout(() => {
                const botMsgWrapper = document.createElement('div');
                botMsgWrapper.className = 'chat-msg bot-msg';
                botMsgWrapper.innerHTML = `<em><i class="fa-solid fa-circle-notch fa-spin"></i> Thinking...</em>`;
                chatbotMessages.appendChild(botMsgWrapper);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                setTimeout(() => {
                    botMsgWrapper.innerHTML = `Based on current weather and Kanpur mandi trends, planting <strong>soybean</strong> next season could yield a 15% higher margin.`;
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1500);

            }, 500);
        }
    });

    // INIT
    translatePage();
    loadDashboardData();
});
