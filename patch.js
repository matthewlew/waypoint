const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('</style>', `
.ei-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.ei-chip { padding: 6px 12px; border-radius: 100px; border: 1px solid hsl(var(--border)); font-size: 13px; cursor: pointer; transition: all 0.15s; background: hsl(var(--background)); color: hsl(var(--foreground)); user-select: none; }
.ei-chip.active { background: hsl(var(--foreground)); color: hsl(var(--background)); border-color: hsl(var(--foreground)); }
.ei-chip:active { transform: scale(0.96); }
@media (hover: hover) { .ei-chip:hover:not(.active) { background: hsl(var(--secondary)); } }
</style>`);

fs.writeFileSync('index.html', html);
