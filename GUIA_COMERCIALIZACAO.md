# Calculadora Piscicultura - caminho para app comercial

## Estado atual

O app agora está preparado como PWA:

- Pode ser instalado pelo navegador quando publicado em HTTPS.
- Tem manifesto de aplicativo em `manifest.webmanifest`.
- Tem ícones em `icons/`.
- Funciona offline com `sw.js`.
- Salva biometrias localmente no aparelho com `localStorage`.

Para testar localmente com instalação PWA, use um servidor local ou publique em um domínio com HTTPS. Abrir direto pelo arquivo `index.html` funciona para uso básico, mas não ativa corretamente instalação e cache offline.

## Melhor caminho para lançar rápido

1. Publicar como PWA em um domínio próprio.
2. Testar com produtores, técnicos e propriedades reais.
3. Criar versão paga quando o fluxo estiver validado.
4. Empacotar para Android com Capacitor ou Trusted Web Activity.
5. Depois avaliar iOS, se houver demanda.

## Monetização sugerida

Para esse app, eu recomendo começar simples:

- Plano gratuito: calculadora e relatório básico.
- Plano pago: histórico por propriedade, exportação avançada, PDF personalizado, múltiplos usuários e backup em nuvem.
- Venda direta para técnicos: licença mensal ou anual.
- Venda para propriedades: assinatura por fazenda/equipe.

Evite começar por anúncios. O público é profissional e a ferramenta precisa parecer confiável.

## Próximas melhorias comerciais

- Cadastro de usuário.
- Login.
- Backup online.
- Relatório PDF com logo da propriedade.
- Histórico por tanque.
- Comparativo entre biometrias.
- Evolução de peso e biomassa por data.
- Controle de permissões por equipe.
- Tela de planos.

## Caminhos técnicos

### PWA

Mais rápido e barato. O usuário acessa por link e instala no celular. Ideal para validar o produto.

### Android

Pode ser empacotado como app de loja usando Capacitor ou Trusted Web Activity. A documentação oficial do Android descreve Trusted Web Activity como uma forma de abrir uma PWA em tela cheia dentro de um app Android.

### iOS

Para vender dentro da App Store com compras ou assinaturas, será necessário configurar produtos no App Store Connect e implementar compras no app.

## Referências oficiais

- Capacitor: https://capacitorjs.com/docs/
- Trusted Web Activity Android: https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities
- Google Play in-app products: https://support.google.com/googleplay/android-developer/answer/1153481
- Apple In-App Purchase: https://developer.apple.com/help/app-store-connect/reference/in-app-purchase-information
- Apple auto-renewable subscriptions: https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/auto-renewable-subscription-information
