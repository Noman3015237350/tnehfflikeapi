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

// Pre-defined keys with your specific requirements
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

// PAID KEYS - 500 credit
const PAID_KEYS_500 = [
    { key: 'TNEHPAID1', credit: 500, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID2', credit: 500, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID3', credit: 500, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID4', credit: 500, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID5', credit: 500, type: 'paid', used: false, created: new Date().toISOString() }
];

// PAID KEYS - 1000 credit
const PAID_KEYS_1000 = [
    { key: 'TNEHPAID10', credit: 1000, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID11', credit: 1000, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID12', credit: 1000, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID13', credit: 1000, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID14', credit: 1000, type: 'paid', used: false, created: new Date().toISOString() },
    { key: 'TNEHPAID15', credit: 1000, type: 'paid', used: false, created: new Date().toISOString() }
];

// FREE KEYS
const FREE_KEYS = [
    { key: 'TNEHFREE1', credit: 1000, type: 'free', used: false, created: new Date().toISOString() },
    { key: 'TNEHFREE2', credit: 1000, type: 'free', used: false, created: new Date().toISOString() }
];

// Combine all paid keys
const PAID_KEYS = [...PAID_KEYS_500, ...PAID_KEYS_1000];

// Initialize data file with pre-defined keys if not exists
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        keys: [...PREMIUM_KEYS, ...PAID_KEYS, ...FREE_KEYS],
        usage: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('✅ Data file created with all keys');
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
    
    // Add paid keys (500 credit) if not exist
    PAID_KEYS_500.forEach(key => {
        if (!existingKeys.includes(key.key)) {
            data.keys.push(key);
            added++;
        }
    });
    
    // Add paid keys (1000 credit) if not exist
    PAID_KEYS_1000.forEach(key => {
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

// Generate TNEHPAID keys (500 credit)
function generatePaidKeys500(count = 5) {
    const keys = [];
    const existingPaidKeys = ['TNEHPAID1', 'TNEHPAID2', 'TNEHPAID3', 'TNEHPAID4', 'TNEHPAID5'];
    for (let i = 0; i < count; i++) {
        keys.push({
            key: existingPaidKeys[i] || `TNEHPAID${i+1}`,
            credit: 500,
            type: 'paid',
            used: false,
            created: new Date().toISOString()
        });
    }
    return keys;
}

// Generate TNEHPAID keys (1000 credit)
function generatePaidKeys1000(count = 6) {
    const keys = [];
    const existingPaidKeys = ['TNEHPAID10', 'TNEHPAID11', 'TNEHPAID12', 'TNEHPAID13', 'TNEHPAID14', 'TNEHPAID15'];
    for (let i = 0; i < count; i++) {
        keys.push({
            key: existingPaidKeys[i] || `TNEHPAID${i+10}`,
            credit: 1000,
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
    const existingFreeKeys = ['TNEHFREE1', 'TNEHFREE2'];
    for (let i = 0; i < count; i++) {
        keys.push({
            key: existingFreeKeys[i] || `TNEHFREE${i+1}`,
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
    const newKeys = generatePaidKeys500(5);
    
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

// 3. Generate 1000 credit paid keys
app.get('/api/credit=1000&createkey&type=paid', (req, res) => {
    const data = readData();
    const newKeys = generatePaidKeys1000(6);
    
    const existingKeys = data.keys.map(k => k.key);
    const filteredNewKeys = newKeys.filter(k => !existingKeys.includes(k.key));
    
    data.keys.push(...filteredNewKeys);
    writeData(data);
    
    res.json({
        success: true,
        message: `${filteredNewKeys.length} paid keys (1000 credit) generated successfully`,
        keys: filteredNewKeys.map(k => k.key),
        total: data.keys.length,
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 4. Generate 1000 credit free keys (2 keys)
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

// 5. Check credit by key
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

// 6. FF Like API (Main endpoint)
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

// 7. Get all keys (admin)
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

// 8. Get usage logs (admin)
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

// 9. Reset all keys (admin)
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

// 10. Get available keys count
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
            paid_500: data.keys.filter(k => k.type === 'paid' && k.credit === 500 && !k.used).length,
            paid_1000: data.keys.filter(k => k.type === 'paid' && k.credit === 1000 && !k.used).length,
            free: data.keys.filter(k => k.type === 'free' && !k.used).length
        },
        developer: "TNEH GROUP",
        telegram: "@tneh_owner"
    });
});

// 11. Root endpoint
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
            generate_paid_1000: "/api/credit=1000&createkey&type=paid",
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
            paid_500: "TNEHPAID1 to TNEHPAID5 (5 keys - 500 credit)",
            paid_1000: "TNEHPAID10 to TNEHPAID15 (6 keys - 1000 credit)",
            free_1000: "TNEHFREE1 to TNEHFREE2 (2 keys)"
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
    console.log('   - Paid (500):', PAID_KEYS_500.length);
    console.log('   - Paid (1000):', PAID_KEYS_1000.length);
    console.log('   - Free (1000):', FREE_KEYS.length);
    console.log('\n📋 Key List:');
    console.log('   Premium Keys:', PREMIUM_KEYS.map(k => k.key).join(', '));
    console.log('   Paid Keys (500):', PAID_KEYS_500.map(k => k.key).join(', '));
    console.log('   Paid Keys (1000):', PAID_KEYS_1000.map(k => k.key).join(', '));
    console.log('   Free Keys:', FREE_KEYS.map(k => k.key).join(', '));
});
