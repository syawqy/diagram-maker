mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    flowchart: { useMaxWidth: true, htmlLabels: true },
  });

  function renderMermaid() {
    const code = document.getElementById('mermaidCode').value;
    const diagram = document.getElementById('diagram');
    
    // Clear the placeholder content
    diagram.innerHTML = '';
    diagram.removeAttribute('data-processed');
    
    // Remove placeholder classes and add diagram content
    diagram.className = 'mermaid min-h-[400px] border-2 border-gray-200 rounded-lg p-4 overflow-auto bg-white';
    
    // Set the mermaid code
    diagram.innerHTML = code;
    
    // Initialize mermaid
    mermaid.init(undefined, diagram);
  }

  async function downloadAsImage() {
  const svgElement = document.querySelector('#diagram svg');
  if (!svgElement) {
    alert("Diagram not rendered yet.");
    return;
  }

  const clone = svgElement.cloneNode(true);

  // Optional: Set width and height if missing
  if (!clone.getAttribute("width") || !clone.getAttribute("height")) {
    clone.setAttribute("width", "800");
    clone.setAttribute("height", "600");
  }

  const width = parseFloat(clone.getAttribute("width"));
  const height = parseFloat(clone.getAttribute("height"));
  const scaleFactor = 2; // 2x resolution for clarity

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor); // Scale drawing
    ctx.fillStyle = '#ffffff'; // Background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(function (blob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'diagram.png';
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  };

  img.onerror = function () {
    alert('Failed to load SVG as image.');
  };

  img.src = svgDataUri;
}

async function copyImageToClipboard() {
  const svgElement = document.querySelector('#diagram svg');
  if (!svgElement) {
    alert("Diagram not rendered yet.");
    return;
  }

  const clone = svgElement.cloneNode(true);

  // Ensure dimensions exist
  if (!clone.getAttribute("width") || !clone.getAttribute("height")) {
    clone.setAttribute("width", "800");
    clone.setAttribute("height", "600");
  }

  const width = parseFloat(clone.getAttribute("width"));
  const height = parseFloat(clone.getAttribute("height"));
  const scaleFactor = 6;

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(async function (blob) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Diagram copied to clipboard as image!');
      } catch (err) {
        console.error(err);
        alert('Failed to copy image. Your browser may not support this feature.');
      }
    }, 'image/png');
  };

  img.src = svgDataUri;
}


  window.onload = renderMermaid;