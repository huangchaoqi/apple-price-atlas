(() => {
  let productKey = '';
  let selection = {};

  const option = (value, delta = 0, disabled = false) => ({ value, delta, disabled });

  function groupsFor(p) {
    const name = p.n;
    if (name.includes('MacBook Pro')) {
      const is16 = name.includes('16');
      return [
        { id: 'screen', label: '屏幕尺寸', default: is16 ? '16 英寸' : '14 英寸', options: [option('14 英寸', is16 ? -900 : 0), option('16 英寸', is16 ? 0 : 900)] },
        { id: 'chip', label: '芯片', default: is16 ? 'M5 Pro' : 'M5', options: [option('M5', is16 ? -400 : 0), option('M5 Pro', is16 ? 0 : 400), option('M5 Max', is16 ? 800 : 1200)] },
        { id: 'memory', label: '内存', default: is16 ? '24GB' : '16GB', options: [option('16GB', is16 ? -200 : 0), option('24GB', is16 ? 0 : 200), option('48GB', is16 ? 400 : 600), option('64GB', is16 ? 600 : 800)] },
        { id: 'storage', label: '存储', default: '512GB', options: [option('512GB'), option('1TB', 200), option('2TB', 600), option('4TB', 1200)] },
        { id: 'color', label: '颜色', default: '深空黑色', options: [option('银色'), option('深空黑色')] }
      ];
    }
    if (name.includes('MacBook Air')) {
      const is15 = name.includes('15');
      return [
        { id: 'screen', label: '屏幕尺寸', default: is15 ? '15 英寸' : '13 英寸', options: [option('13 英寸', is15 ? -200 : 0), option('15 英寸', is15 ? 0 : 200)] },
        { id: 'memory', label: '内存', default: '16GB', options: [option('16GB'), option('24GB', 200), option('32GB', 400)] },
        { id: 'storage', label: '存储', default: '256GB', options: [option('256GB'), option('512GB', 200), option('1TB', 400), option('2TB', 800)] },
        { id: 'color', label: '颜色', default: '午夜色', options: [option('天蓝色'), option('银色'), option('星光色'), option('午夜色')] }
      ];
    }
    if (p.c === 'Mac') {
      return [
        { id: 'chip', label: '芯片', default: '标准芯片', options: [option('标准芯片'), option('Pro 芯片', 400), option('Max 芯片', 1000)] },
        { id: 'memory', label: '内存', default: '16GB', options: [option('16GB'), option('24GB', 200), option('32GB', 400), option('64GB', 800)] },
        { id: 'storage', label: '存储', default: '256GB', options: [option('256GB'), option('512GB', 200), option('1TB', 400), option('2TB', 800)] }
      ];
    }
    if (p.c === 'iPhone') {
      const base = p.s.includes('256') ? '256GB' : '128GB';
      return [
        { id: 'storage', label: '存储容量', default: base, options: [option('128GB', base === '256GB' ? -100 : 0, base === '256GB'), option('256GB', base === '256GB' ? 0 : 100), option('512GB', base === '256GB' ? 200 : 300), option('1TB', base === '256GB' ? 400 : 500)] },
        { id: 'color', label: '颜色', default: '黑色', options: [option('黑色'), option('白色'), option('蓝色'), option('粉色')] }
      ];
    }
    if (p.c === 'iPad') {
      const base = p.s.includes('256') ? '256GB' : '128GB';
      return [
        { id: 'storage', label: '存储容量', default: base, options: [option('128GB', base === '256GB' ? -100 : 0, base === '256GB'), option('256GB', base === '256GB' ? 0 : 100), option('512GB', base === '256GB' ? 200 : 300), option('1TB', base === '256GB' ? 400 : 500)] },
        { id: 'network', label: '网络', default: 'Wi‑Fi', options: [option('Wi‑Fi'), option('Wi‑Fi + 蜂窝网络', 150)] },
        { id: 'color', label: '颜色', default: '深空灰色', options: [option('银色'), option('蓝色'), option('紫色'), option('深空灰色')] }
      ];
    }
    if (p.c === 'Watch') {
      return [
        { id: 'size', label: '表壳尺寸', default: p.s.includes('49') ? '49mm' : p.s.includes('42') ? '42mm' : '40mm', options: [option('40mm'), option('42mm', 30), option('46mm', 50), option('49mm', 100)] },
        { id: 'network', label: '连接方式', default: p.s.includes('蜂窝') ? 'GPS + 蜂窝网络' : 'GPS', options: [option('GPS'), option('GPS + 蜂窝网络', 100)] },
        { id: 'color', label: '表壳颜色', default: '午夜色', options: [option('午夜色'), option('星光色'), option('银色')] }
      ];
    }
    if (p.c === 'Vision') return [{ id: 'storage', label: '存储容量', default: '256GB', options: [option('256GB'), option('512GB', 200), option('1TB', 400)] }];
    return [];
  }

  function ensure(p) {
    const key = `${p.n}|${p.s}`;
    const groups = groupsFor(p);
    if (productKey !== key) {
      productKey = key;
      selection = Object.fromEntries(groups.map(g => [g.id, g.default]));
    }
    const delta = groups.reduce((sum, g) => sum + (g.options.find(o => o.value === selection[g.id])?.delta || 0), 0);
    const summary = groups.length ? groups.map(g => selection[g.id]).join(' · ') : `${p.s} · 无额外配置`;
    return { groups, delta, summary };
  }

  function select(group, value) { selection[group] = value; }
  function reset() { productKey = ''; selection = {}; }
  function render(p) {
    const state = ensure(p);
    return state.groups.length ? state.groups.map(g => `<div class="config-group"><span>${g.label}</span><div class="config-choices">${g.options.map(o => `<button type="button" data-config-group="${g.id}" data-config-value="${o.value}" class="${selection[g.id] === o.value ? 'selected' : ''}" ${o.disabled ? 'disabled' : ''}>${o.value}</button>`).join('')}</div></div>`).join('') : '<p class="no-config">这款产品没有需要比较的额外配置。</p>';
  }

  window.ATLAS_CONFIG = { ensure, select, reset, render };
})();
