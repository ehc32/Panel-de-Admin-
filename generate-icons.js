// Script para generar iconos PWA
// Ejecutar: node generate-icons.js

const fs = require('fs');
const path = require('path');

console.log('🎨 Generador de Iconos PWA\n');
console.log('⚠️  Este script requiere que instales Sharp primero:');
console.log('   npm install sharp --save-dev\n');
console.log('📝 Luego ejecuta: node generate-icons.js\n');

// Verificar si sharp está instalado
try {
  const sharp = require('sharp');
  
  const inputPath = path.join(__dirname, 'public', 'Icono.jpg');
  const sizes = [192, 512];
  
  console.log('✅ Sharp encontrado, generando iconos...\n');
  
  // Verificar que existe el icono fuente
  if (!fs.existsSync(inputPath)) {
    console.error('❌ Error: No se encontró public/Icono.jpg');
    process.exit(1);
  }
  
  // Generar cada tamaño
  Promise.all(
    sizes.map(size => {
      const outputPath = path.join(__dirname, 'public', `icon-${size}x${size}.png`);
      
      return sharp(inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath)
        .then(() => {
          console.log(`✅ Generado: icon-${size}x${size}.png`);
        })
        .catch(err => {
          console.error(`❌ Error generando icon-${size}x${size}.png:`, err.message);
        });
    })
  ).then(() => {
    console.log('\n🎉 ¡Iconos generados exitosamente!');
    console.log('\n📱 Próximos pasos:');
    console.log('   1. npm run build');
    console.log('   2. npm start');
    console.log('   3. Abre la app en tu celular y agrégala a la pantalla de inicio\n');
  }).catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  });
  
} catch (err) {
  console.log('⚠️  Sharp no está instalado.');
  console.log('\n📦 Para instalar Sharp y generar los iconos automáticamente:');
  console.log('   npm install sharp --save-dev');
  console.log('   node generate-icons.js\n');
  console.log('🔄 O genera los iconos manualmente siguiendo las instrucciones en INSTRUCCIONES_PWA.md\n');
}
