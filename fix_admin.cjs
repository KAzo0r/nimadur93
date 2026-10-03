const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

if (!code.includes('formatPrice')) {
  code = code.replace(/import \{ useNavigate \} from 'react-router-dom';/, "import { useNavigate } from 'react-router-dom';\nimport { formatPrice } from '../utils/currency';");
}

code = code.replace(/`\$\{salesToday\.toLocaleString\(\)\} UZS`/g, 'formatPrice(salesToday, i18n.language)');
code = code.replace(/`\$\{totalRevenue\.toLocaleString\(\)\} UZS`/g, 'formatPrice(totalRevenue, i18n.language)');
code = code.replace(/\{order\.total\.toLocaleString\(\)\} UZS/g, '{formatPrice(order.total, i18n.language)}');
code = code.replace(/\{p\.price\.toLocaleString\(\)\} UZS/g, '{formatPrice(p.price, i18n.language)}');
code = code.replace(/\{order\.total\?\.toLocaleString\(\)\} UZS/g, '{formatPrice(order.total || 0, i18n.language)}');
code = code.replace(/\{c\.spent\} UZS/g, '{formatPrice(c.spent, i18n.language)}');
code = code.replace(/\{p\.price\?\.toLocaleString\(\)\} UZS/g, '{formatPrice(p.price || 0, i18n.language)}');
code = code.replace(/`\$\{\(orders\?\.reduce\(\(a,o\)=>a\+\(o\.total\|\|0\),0\)\|\|0\)\.toLocaleString\(\)\} UZS`/g, 'formatPrice(orders?.reduce((a,o)=>a+(o.total||0),0)||0, i18n.language)');
code = code.replace(/`\$\{\(orders\?\.filter\(o=>o\.paymentMethod==='card'\)\.reduce\(\(a,o\)=>a\+\(o\.total\|\|0\),0\)\|\|0\)\.toLocaleString\(\)\} UZS`/g, 'formatPrice(orders?.filter(o=>o.paymentMethod===\'card\').reduce((a,o)=>a+(o.total||0),0)||0, i18n.language)');
code = code.replace(/`\$\{\(orders\?\.filter\(o=>o\.paymentMethod==='cash'\)\.reduce\(\(a,o\)=>a\+\(o\.total\|\|0\),0\)\|\|0\)\.toLocaleString\(\)\} UZS`/g, 'formatPrice(orders?.filter(o=>o.paymentMethod===\'cash\').reduce((a,o)=>a+(o.total||0),0)||0, i18n.language)');
code = code.replace(/\+\{o\.total\?\.toLocaleString\(\)\} UZS/g, '+{formatPrice(o.total || 0, i18n.language)}');
code = code.replace(/'30,000 UZS'/g, 'formatPrice(30000, i18n.language)');
code = code.replace(/'60,000 UZS'/g, 'formatPrice(60000, i18n.language)');
code = code.replace(/13,500,000 UZS/g, '13,500,000 UZS'); // Ignore desc strings if any

fs.writeFileSync('src/pages/Admin.jsx', code);
console.log('Admin.jsx fixed!');
