# Como usar sem o computador ligado

O link `http://192.168...` funciona apenas enquanto o computador está ligado porque ele está servindo o app pela rede local.

Para usar em campo sem computador, publique o app em um endereço HTTPS e instale no celular.

## Caminho mais rápido

1. Publique esta pasta como site estático em uma hospedagem com HTTPS.
2. Abra o link publicado no celular.
3. No Android/Chrome, toque no botão de instalar ou no menu do navegador e escolha "Adicionar à tela inicial" / "Instalar app".
4. Abra o app instalado uma vez ainda com internet.
5. Depois disso, ele pode abrir em campo sem o computador ligado.

## Hospedagens simples

- Netlify Drop: arrastar o arquivo `.zip` ou a pasta do app.
- Vercel: importar a pasta como projeto estático.
- GitHub Pages: publicar os arquivos do app em um repositório.

## Importante

- O app salva os dados no próprio celular.
- Se limpar dados do navegador, trocar de celular ou desinstalar o app, os registros locais podem ser perdidos.
- Para produto comercial, o ideal é adicionar login e backup em nuvem.
- Para publicar na Play Store como APK/AAB, o próximo passo é empacotar com Capacitor ou Trusted Web Activity.

## Arquivos principais

- `index.html`
- `styles.css`
- `script.js`
- `manifest.webmanifest`
- `sw.js`
- `icons/`
