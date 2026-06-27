const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage
const DATA_FILE = path.join(__dirname, 'data.json');

// Pre-defined keys
const PREMIUM_KEYS = [];
for (let i = 1; i <= 20; i++) {
    const num = String(i).padStart(2, '0');
    PREMIUM_KEYS.push({
        key: `TNEHPREMIUM${num}`,
        credit: 1000,
        type: 'premium',
        used: false,
        created: new Date().toISOString()
    });
}

const PAID_KEYS = [];
for (let i = 1; i <= 20; i++) {
    const num = String(i).padStart(2, '0');
    PAID_KEYS.push({
        key: `TNEHPAID${num}`,
        credit: 500,
        type: 'paid',
        used: false,
        created: new Date().toISOString()
    });
}

const FREE_KEYS = [];
for (let i = 1; i <= 2; i++) {
    const num = String(i).padStart(2, '0');
    FREE_KEYS.push({
        key: `TNEHFREE${num}`,
        credit: 1000,
        type: 'free',
        used: false,
        created: new Date().toISOString()
    });
}

// Initialize data file with pre-defined keys if not exists
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        keys: [...PREMIUM_KEYS, ...PAID_KEYS, ...FREE_KEYS],
        usage: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
} else {
    // Check if keys exist, if not add them
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const existingKeys = data.keys.map(k => k.key);
    let added = 0;
    
    // Add premium keys if not exist
    PREMIUM_KEYS.forEach(key => {
        if (!existingKeys.includes(key.key)) {
            data.keys.push(key);
            added++;
        }
    });
    
    // Add paid keys if not exist
    PAID_KEYS.forEach(key => {
        if (!existingKeys.includes(key.key)) {
            data.keys.push(key);
            added++;
        }
    });
    
    // Add free keys if not exist
    FREE_KEYS.forEach(key => {
        if (!existingKeys.includes(key.key)) {
            data.keys.push(key);
            added++;
        }
    });
    
    if (added > 0) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log(`✅ Added ${added} new keys to existing data`);
    }
}

// Read data from file
function readData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        return { keys: [...PREMIUM_KEYS, ...PAID_KEYS, ...FREE_KEYS], usage: [] };
    }
}

// Write data to file
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate random key
function generateKey(prefix, length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = prefix;
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// Generate TNEHPREMIUM keys (20 keys for 1000 credits)
function generatePremiumKeys(count = 20) {
    const keys = [];
    for (let i = 0; i < count; i++) {
        const num = String(i + 1).padStart(2, '0');
        keys.push({
            key: `TNEHPREMIUM${num}`,
            credit: 1000,
            type: 'premium',
            used: false,
            created: new Date().toISOString()
        });
    }
    return keys;
}

// Generate TNEHPAID keys (20 keys for 500 credits)
function generatePaidKeys(count = 20) {
    const keys = [];
    for (let i = 0; i < count; i++) {
        const num = String(i + 1).padStart(2, '0');
        keys.push({
            key: `TNEHPAID${num}`,
            credit: 500,
            type: 'paid',
            used: false,
            created: new Date().toISOString()
        });
    }
    return keys;
}

// Generate TNEHFREE keys (2 keys for 1000 credits)
function generateFreeKeys(count = 2) {
    const keys = [];
    for (let i = 0; i < count; i++) {
        const num = String(i + 1).padStart(2, '0');
        keys.push({
            key: `TNEHFREE${num}`,
            credit: 1000,
            type: 'free',
            used: false,
            created: new Date().toISOString()
        });
    }
    return keys;
}

// API Endpoints

// 1. Generate 1000 credit premium keys
app.get('/api/credit=1000&createkey', (req, res) => {
    const data = readData();
    const newKeys = generatePremiumKeys(20);
    
    // Check if keys already exist
    const existingKeys = data.keys.map(k => k.key);
    const filteredNewKeys = newKeys.filter(k => !existingKeys.includes(k.key));
    
    data.keys.push(...filteredNewKeys);
    writeData(data);
    
    res.json({
        success: true,
        message: `${filteredNewKeys.length} premium keys (1000 credit) generated successfully`,
        keys: filteredNewKeys.map(k => k.key),
        total: data.keys.length,
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 2. Generate 500 credit paid keys
app.get('/api/credit=500&createkey', (req, res) => {
    const data = readData();
    const newKeys = generatePaidKeys(20);
    
    const existingKeys = data.keys.map(k => k.key);
    const filteredNewKeys = newKeys.filter(k => !existingKeys.includes(k.key));
    
    data.keys.push(...filteredNewKeys);
    writeData(data);
    
    res.json({
        success: true,
        message: `${filteredNewKeys.length} paid keys (500 credit) generated successfully`,
        keys: filteredNewKeys.map(k => k.key),
        total: data.keys.length,
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 3. Generate 1000 credit free keys (2 keys)
app.get('/api/credit=1000&createkey&type=free', (req, res) => {
    const data = readData();
    const newKeys = generateFreeKeys(2);
    
    const existingKeys = data.keys.map(k => k.key);
    const filteredNewKeys = newKeys.filter(k => !existingKeys.includes(k.key));
    
    data.keys.push(...filteredNewKeys);
    writeData(data);
    
    res.json({
        success: true,
        message: `${filteredNewKeys.length} free keys (1000 credit) generated successfully`,
        keys: filteredNewKeys.map(k => k.key),
        total: data.keys.length,
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 4. Check credit by key
app.get('/api/check/credit', (req, res) => {
    const { key } = req.query;
    
    if (!key) {
        return res.status(400).json({
            success: false,
            message: "Key parameter is required",
            developer: "TNEH GROUP",
            telegram: "@tneh_owner"
        });
    }
    
    const data = readData();
    const keyData = data.keys.find(k => k.key === key);
    
    if (!keyData) {
        return res.json({
            success: false,
            message: "Invalid key",
            developer: "TNEH GROUP",
            telegram: "@tneh_owner"
        });
    }
    
    if (keyData.used) {
        return res.json({
            success: false,
            message: "Key already used",
            key: keyData.key,
            credit: keyData.credit,
            type: keyData.type,
            developer: "TNEH GROUP",
            telegram: "@tneh_owner"
        });
    }
    
    res.json({
        success: true,
        message: "Key is valid",
        key: keyData.key,
        credit: keyData.credit,
        type: keyData.type,
        created: keyData.created,
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 5. FF Like API (Main endpoint)
app.get('/api/fflike', async (req, res) => {
    const { key, region, uid } = req.query;
    const startTime = Date.now();
    
    if (!key || !region || !uid) {
        return res.status(400).json({
            success: false,
            message: "Missing parameters. Required: key, region, uid",
            usage: "/api/fflike?key=YOUR_KEY&region=BD&uid=3015237350",
            developer: "TNEH GROUP",
            telegram: "@tneh_owner"
        });
    }
    
    // Validate key
    const data = readData();
    const keyData = data.keys.find(k => k.key === key);
    
    if (!keyData) {
        return res.json({
            success: false,
            message: "Invalid API key",
            developer: "TNEH GROUP",
            telegram: "@tneh_owner"
        });
    }
    
    if (keyData.used) {
        return res.json({
            success: false,
            message: "API key already used",
            key: keyData.key,
            credit: keyData.credit,
            developer: "TNEH GROUP",
            telegram: "@tneh_owner"
        });
    }
    
    try {
        // Call main FF Like API
        const response = await axios.get(`https://api.lmnx9.shop/ff-like.php?region=${region}&uid=${uid}`, {
            timeout: 30000
        });
        
        const apiResponse = response.data;
        const reqTime = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
        
        // Mark key as used
        keyData.used = true;
        keyData.usedAt = new Date().toISOString();
        keyData.usedFor = { region, uid };
        writeData(data);
        
        // Log usage
        data.usage.push({
            key: key,
            region,
            uid,
            usedAt: new Date().toISOString(),
            success: apiResponse.Success
        });
        writeData(data);
        
        // Return response in TNEH format
        res.json({
            success: apiResponse.Success || true,
            API: "TNEH FF Liker v4.0",
            Developer: "TNEH GROUP",
            Telegram: "@tneh_owner",
            Website: "https://tnehff.base44.app",
            req_Time: reqTime,
            FF_Nickname: apiResponse.FF_Nickname || "Unknown",
            FF_UID: apiResponse.FF_UID || uid,
            FF_Likes_Before: apiResponse.FF_Likes_Before || 0,
            FF_Likes_After: apiResponse.FF_Likes_After || 0,
            FF_Likes_Sent: apiResponse.FF_Likes_Sent || 0,
            key_used: key,
            credit_used: keyData.credit
        });
        
    } catch (error) {
        console.error('FF Like API Error:', error.message);
        
        // Don't mark key as used if API failed
        res.json({
            success: false,
            API: "TNEH FF Liker v4.0",
            Developer: "TNEH GROUP",
            Telegram: "@tneh_owner",
            Website: "https://tnehff.base44.app",
            message: "Failed to process FF Like request",
            error: error.message,
            req_Time: ((Date.now() - startTime) / 1000).toFixed(2) + 's'
        });
    }
});

// 6. Get all keys (admin)
app.get('/api/keys', (req, res) => {
    const data = readData();
    const keysWithStatus = data.keys.map(k => ({
        key: k.key,
        credit: k.credit,
        type: k.type,
        used: k.used,
        created: k.created,
        usedAt: k.usedAt || null,
        usedFor: k.usedFor || null
    }));
    
    res.json({
        success: true,
        total: keysWithStatus.length,
        used: keysWithStatus.filter(k => k.used).length,
        available: keysWithStatus.filter(k => !k.used).length,
        keys: keysWithStatus,
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 7. Get usage logs (admin)
app.get('/api/logs', (req, res) => {
    const data = readData();
    res.json({
        success: true,
        total: data.usage.length,
        logs: data.usage,
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 8. Reset all keys (admin)
app.get('/api/reset', (req, res) => {
    const data = readData();
    data.keys.forEach(k => {
        k.used = false;
        k.usedAt = null;
        k.usedFor = null;
    });
    data.usage = [];
    writeData(data);
    
    res.json({
        success: true,
        message: "All keys have been reset",
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 9. Get available keys count
app.get('/api/available', (req, res) => {
    const data = readData();
    const available = data.keys.filter(k => !k.used);
    const total = data.keys.length;
    
    res.json({
        success: true,
        total_keys: total,
        available_keys: available.length,
        used_keys: total - available.length,
        keys_by_type: {
            premium: data.keys.filter(k => k.type === 'premium' && !k.used).length,
            paid: data.keys.filter(k => k.type === 'paid' && !k.used).length,
            free: data.keys.filter(k => k.type === 'free' && !k.used).length
        },
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 10. Root endpoint
app.get('/', (req, res) => {
    const data = readData();
    const available = data.keys.filter(k => !k.used);
    
    res.json({
        success: true,
        API: "TNEH FF Liker v4.0",
        Developer: "TNEH GROUP",
        Telegram: "@tneh_owner",
        Website: "https://tnehff.base44.app",
        stats: {
            total_keys: data.keys.length,
            available_keys: available.length,
            used_keys: data.keys.length - available.length
        },
        endpoints: {
            generate_premium_1000: "/api/credit=1000&createkey",
            generate_paid_500: "/api/credit=500&createkey",
            generate_free_1000: "/api/credit=1000&createkey&type=free",
            check_credit: "/api/check/credit?key=YOUR_KEY",
            ff_like: "/api/fflike?key=YOUR_KEY&region=BD&uid=3015237350",
            all_keys: "/api/keys",
            logs: "/api/logs",
            reset: "/api/reset",
            available: "/api/available"
        },
        regions: {
            BD: "Bangladesh Server",
            BR: "Brazil Server", 
            IND: "India Server",
            NA: "North America Server",
            SAC: "South America Server",
            US: "USA Server"
        },
        pre_defined_keys: {
            premium_1000: "TNEHPREMIUM01 to TNEHPREMIUM20 (20 keys)",
            paid_500: "TNEHPAID01 to TNEHPAID20 (20 keys)",
            free_1000: "TNEHFREE01 to TNEHFREE02 (2 keys)"
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🔥 TNEH FF Liker v4.0 API Server');
    console.log('🚀 Server running on port', PORT);
    console.log('📡 http://localhost:' + PORT);
    console.log('👨‍💻 Developer: TNEH GROUP');
    console.log('📱 Telegram: @tneh_owner');
    console.log('📊 Total Keys: ' + (PREMIUM_KEYS.length + PAID_KEYS.length + FREE_KEYS.length));
    console.log('   - Premium (1000):', PREMIUM_KEYS.length);
    console.log('   - Paid (500):', PAID_KEYS.length);
    console.log('   - Free (1000):', FREE_KEYS.length);
});
