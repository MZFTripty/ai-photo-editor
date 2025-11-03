// 🧪 Browser Console Test Script
// Copy & paste this in browser console (F12)

console.log("🧪 Skew Z & Perspective Z Test Started");

// Test 1: Check if transforms object exists
setTimeout(() => {
  const imgElement = document.querySelector("img[alt='Image for selection']");
  if (imgElement) {
    const style = imgElement.getAttribute("style");
    console.log("✅ Image found");
    console.log("📋 Current style:", style);

    if (style && style.includes("transform:")) {
      const transformMatch = style.match(/transform: ([^;]+)/);
      const transform = transformMatch ? transformMatch[1] : "none";
      console.log("🎨 Transform value:", transform);

      if (transform.includes("rotateZ") || transform.includes("rotateX")) {
        console.log("✅ PASS - Transform is applied!");
      } else {
        console.log("❌ FAIL - Transform missing");
      }
    } else {
      console.log("❌ FAIL - No transform in style");
    }
  } else {
    console.log("❌ Image element not found");
  }
}, 100);

// Test 2: Check sliders
setTimeout(() => {
  console.log("\n📊 Checking sliders...");
  const skewZSlider = document.querySelector("input[type='range']");
  if (skewZSlider) {
    console.log("✅ Sliders found");
  }
}, 200);

// Test 3: Check console for our logs
setTimeout(() => {
  console.log("\n📝 Make sure you see these logs above:");
  console.log("  - 🎬 Applying 3D Transform - RAW PARAMS");
  console.log("  - ✅ Added Skew Z (via matrix)");
  console.log("  - ✅ Added Perspective Z");
  console.log("  - 🎨 Final CSS Transform string");
}, 300);

console.log("\n✅ Test complete! Check the logs above.");
