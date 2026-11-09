/**
 * CONFIGURAÇÃO COMERCIAL — IA de Verdade
 * ------------------------------------------------------------
 * Este é o único lugar onde preços, links de checkout, Pixel,
 * dados legais e prazos devem ser alterados.
 *
 * Depois de editar, rode:  node scripts/build.js
 * O arquivo gerado é o index.html.
 *
 * Valores vazios bloqueiam o build de produção; no preview, os
 * pontos pendentes são tratados sem inventar dados.
 */
module.exports = {
  site: {
    name: 'IA de Verdade',
    edition: 'novembro de 2026',
    // URL pública final, com https e barra no fim.
    // Cloudflare Pages (gratuito): 'https://SEU-PROJETO.pages.dev/'
    // Domínio próprio (depois): 'https://iadeverdade.com.br/'
    // Também aceita a variável de ambiente IADV_SITE_URL no build.
    // Enquanto estiver vazia, canonical e Open Graph absoluto ficam pendentes.
    url: '',
    ogImage: 'assets/og-image.jpg',
    locale: 'pt_BR',
  },

  author: {
    name: 'Giliarde Reis Pereira',
    role: 'Tech Lead Backend',
    linkedin: 'https://www.linkedin.com/in/giliarde-reis-pereira',
    email: 'iadeverdade.oficial@gmail.com', // atendimento oficial
  },

  /**
   * Condição de lançamento.
   * - active: true mantém o preço de lançamento enquanto a oferta estiver publicada.
   * - endsAt: data/hora real de encerramento (ISO 8601) ou null.
   *   Se preenchida, a página mostra a data e passa a exibir o preço regular
   *   automaticamente depois do prazo — sem cronômetro e sem reinício por visitante.
   */
  promo: {
    active: true,
    endsAt: null, // ex.: '2026-12-15T23:59:59-03:00'
    label: 'Condição de lançamento',
  },

  // Lote de lançamento. Não há contador regressivo.
  // mode: 'quantity' (limit) ou 'date' (endsAt).
  // sold só deve ser preenchido com número real; se sold >= limit, o preço regular entra sozinho.
  // Ao atingir o limite, troque o preço na Hotmart e desligue active.
  launch: {
    mode: 'quantity',
    limit: 100,
    endsAt: '',
    active: true,
    sold: null,
  },

  // Preços planejados da oferta. Não inclua âncora de R$ 329 sem histórico real.
  // Recursos de oferta que dependem de configuração externa.
  offers: {
    // Só deixe true quando o order bump estiver REALMENTE configurado no checkout
    // do Volume 1. Enquanto false, o bloco de bump e o FAQ correspondente ficam ocultos.
    bumpEnabled: false,
  },

  prices: {
    collectionLaunch: 197.0,
    collectionRegular: 247.0,
    vol1: 39.9,
    // Volumes 2–6: preço individual definido para a vitrine.
    vol2: 59.9,
    vol3: 59.9,
    vol4: 59.9,
    vol5: 49.9,
    vol6: 49.9,
    catalogLaunch: 69.9,
    catalogRegular: 89.9,
    catalogIndividual: 69.9,
    bump: 27.0, // Volume de Referência + Catálogo + planilha, só no checkout do Volume 1
  },

  // Links de checkout. Cole a URL completa de cada produto/oferta.
  // Funciona com Hotmart, Kiwify ou outra plataforma:
  //   Hotmart: https://pay.hotmart.com/XXXXXXXXX
  //   Kiwify:  https://pay.kiwify.com.br/XXXXXXXX
  // O order bump e o upsell são configurados NA PLATAFORMA de checkout;
  // veja docs/INTEGRACAO.md e docs/PLATAFORMAS-CHECKOUT.md.
  checkout: {
    collection: '',
    vol1: '',
    vol1Bump: '', // checkout do Volume 1 com o order bump habilitado (se existir)
    vol2: '',
    vol3: '',
    vol4: '',
    vol5: '',
    vol6: '',
    catalog: '',
  },

  sample: {
    enabled: true,
    path: 'assets/amostra/IA-de-Verdade-Amostra-Cap1-2.pdf',
  },

  // Entrega automática pela plataforma (Hotmart/Kiwify) após a confirmação
  // do pagamento. O texto abaixo descreve a COLEÇÃO COMPLETA (7 PDFs + XLSX).
  // O FAQ detalha o Volume 1 e o catálogo separadamente.
  // Ajuste se o formato mudar (download, área de membros, .zip etc.).
  delivery: {
    confirmed: true,
    description: 'Entrega automática pela plataforma de checkout após a confirmação do pagamento. Você recebe 7 PDFs, 7 EPUBs e a planilha XLSX.',
  },

  guarantee: {
    days: 7,
    confirmed: false,
    process: '', // ex.: 'Envie um e-mail para ... em até 7 dias...'
  },

  /**
   * Dados legais. A venda inicial é feita como PESSOA FÍSICA (CPF).
   * - entityType: 'pf' (padrão) ou 'pj'. Em 'pf', os campos company/cnpj são ignorados.
   * - name: nome completo exibido no rodapé.
   * - cpf: não exibido no rodapé; a identificação pública usa nome + atendimento.
   *   Avalie com apoio jurídico a obrigação de identificação na plataforma.
   * - email: canal público de atendimento (recomendado).
   */
  legal: {
    entityType: 'pf',
    name: 'Giliarde Reis Pereira',
    cpf: '',
    company: '', // usado somente se entityType = 'pj'
    cnpj: '', // usado somente se entityType = 'pj'
    email: 'iadeverdade.oficial@gmail.com',
    privacyUrl: '',
    termsUrl: '',
    refundUrl: '',
  },

  tracking: {
    metaPixelId: '', // NÃO use um ID fictício. O Pixel só carrega após consentimento.
    ga4Id: '', // Google Analytics 4 no formato G-XXXXXXXXXX. Também só carrega após consentimento.
    gscVerification: '', // Código do meta google-site-verification (Search Console, propriedade "prefixo de URL").
    enabled: false, // true libera Pixel e GA4 quando os IDs estiverem preenchidos.
    debug: false,
    currency: 'BRL',
  },

  /**
   * Depoimentos REAIS. Deixe vazio até ter compradores dispostos a autorizar
   * a publicação (nome, contexto e, se houver, resultado verificável).
   * Formato: { nome, perfil, texto, data, autorizado: true }
   * Só itens com autorizado: true entram no DOM. Não use texto provisório.
   * NUNCA preencha com depoimento inventado, foto de banco de imagens ou
   * número de compradores fictício.
   */
  testimonials: [],

  // Área de vídeo de vendas. Se enabled=false, a seção usa a galeria editorial real.
  video: {
    enabled: false,
    embedUrl: '', // URL de incorporação (YouTube/Vimeo/etc.)
    title: 'Apresentação da coleção IA de Verdade',
  },

  flags: {
    showPending: true, // exibe selos "a confirmar" em dados ainda não definidos
    structuredData: true, // JSON-LD de produto (sem avaliações inventadas)
    mobileStickyCta: true,
    testimonials: false, // só ative com depoimentos reais em testimonials[]
  },
};
