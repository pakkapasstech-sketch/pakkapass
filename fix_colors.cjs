const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/Users/komal/OneDrive/Desktop/pakka_pass/frontend/src/components/content',
  'c:/Users/komal/OneDrive/Desktop/pakka_pass/frontend/src/pages/ContentManagement'
];

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Convert hardcoded hex colors to var(), checking that they aren't already wrapped.
    // Replace hex in `background: '#ffffff'` or `backgroundColor: '#fff'`
    content = content.replace(/(background(?:Color)?:\s*)['"](?:#ffffff|#fff)['"]/gi, "$1'var(--color-card, #ffffff)'");
    
    content = content.replace(/(background(?:Color)?:\s*)['"]#f9fafb['"]/gi, "$1'var(--color-surface, #f9fafb)'");
    content = content.replace(/(color:\s*)['"]#111827['"]/gi, "$1'var(--color-text-primary, #111827)'");
    
    content = content.replace(/(color:\s*)['"]#(?:64748b|6b7280)['"]/gi, "$1'var(--color-text-secondary, #6b7280)'");
    content = content.replace(/(color:\s*)['"]#9ca3af['"]/gi, "$1'var(--color-text-muted, #9ca3af)'");
    
    // Replace border colors. Usually `border: '1px solid #e5e7eb'`
    content = content.replace(/(border(?:Top|Bottom|Left|Right)?:\s*['"][^'"]+)#(?:e5e7eb|d1d5db)([^'"]*['"])/gi, "$1var(--color-border, #e5e7eb)$2");
    
    // If there is any bare '#e5e7eb' or '#d1d5db' as borderColor
    content = content.replace(/(borderColor:\s*)['"]#(?:e5e7eb|d1d5db)['"]/gi, "$1'var(--color-border, #e5e7eb)'");

    // Replace background: '#f3f4f6'
    content = content.replace(/(background(?:Color)?:\s*)['"]#f3f4f6['"]/gi, "$1'var(--color-border-light, #f3f4f6)'");

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated', file);
    }
  }
}
