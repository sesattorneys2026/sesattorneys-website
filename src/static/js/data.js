/*
  SITE CONTENT AND SETTINGS
  Edit this file to change firm details, contact info and practice area text.
*/
window.SITE = {
  firm: 'SES Attorneys',
  firmMark: 'SES',
  firmSub: 'Advocates & Legal Consultants',
  domain: 'sesattorneys.com',
  tagline: 'Legal and consultancy services from Pune, India, guided by quality, unity and integrity.',

  addressShort: '1707, Sadashiv Peth, Opp. Scout Ground, Pune 411030',

  /* Office and court chamber. Shown on the contact page (with maps) and in the footer. */
  locations: [
    {
      label: 'Office address',
      footerLabel: 'Office',
      address: '1707, Sadashiv Peth, Near Udyan Prasad Karyalaya, Opposite Scout Ground, Pune 411030.',
      footerAddress: '1707, Sadashiv Peth, Near Udyan Prasad Karyalaya, Opp. Scout Ground, Pune 411030',
      directions: 'https://maps.app.goo.gl/NeLPkg8JNrSyh1f29',
      mapQuery: 'Udyan Karyalaya, 1712/1B, CV Joshi Rd, Sadashiv Peth, Pune 411030',
      street: '1707, Sadashiv Peth, Near Udyan Prasad Karyalaya, Opposite Scout Ground', locality: 'Pune', region: 'Maharashtra', postalCode: '411030'
    },
    {
      label: 'Court chamber address',
      footerLabel: 'Court chamber',
      address: 'Shree Chambers, 1st floor, Opposite Shivajinagar District Court Gate No. 4, Near Family Court Building, Shivajinagar, Pune 411005.',
      footerAddress: 'Shree Chambers, 1st floor, Opp. District Court Gate No. 4, Near Family Court, Shivajinagar, Pune 411005',
      directions: 'https://maps.app.goo.gl/iXptasUak4Cu8LEd7',
      mapQuery: 'Shivajinagar District Court, Shivajinagar, Pune 411005',
      street: 'Shree Chambers, 1st floor, Opposite Shivajinagar District Court Gate No. 4, Near Family Court Building, Shivajinagar', locality: 'Pune', region: 'Maharashtra', postalCode: '411005'
    }
  ],

  /* Main contact shown in the top bar, menus, CTA, footer, careers and contact page. */
  contact: {
    name: 'Adv. Sandeepak Phadke',
    phone: '+91 98225 96975',
    email: 'sandeepak@sesattorneys.com'
  },

  /* Shown on the home page and contact page. Add more objects here to list more advocates.
     phone and email are optional: leave them out and the card shows the name only. */
  advocates: [
    { name: 'Adv. Sandeepak Phadke', phone: '+91 98225 96975', email: 'sandeepak@sesattorneys.com' },
    { name: 'Adv. Sadanand (Nandu) Phadke' }
  ],

  /* International format, digits only. */
  whatsappNumber: '919822596975',

  /* All images are stored inside the site in /images. */
  imageBase: '/images/',

  /* Bar Council of India disclaimer. Shown as a pop-up on the first visit (set disclaimerPopup to false
     to turn it off) and on the Disclaimer page. */
  disclaimerPopup: true,
  disclaimerIntro: 'The Bar Council of India does not permit advocates to solicit work or advertise. By clicking "I agree" and accessing this website, you acknowledge that:',
  disclaimerPoints: [
    'You are seeking information about SES Attorneys of your own accord and there has been no advertisement, solicitation, invitation or inducement of any sort by the firm or its members.',
    'Information on this website is for general information only and does not constitute legal advice.',
    'Using this website or contacting us through it does not create an advocate-client relationship.',
    'SES Attorneys is not liable for any action taken on the basis of information on this website.'
  ],

  principles: [
    { n: '01', t: 'Quality', d: 'Careful and thorough work on every matter we handle.' },
    { n: '02', t: 'Unity', d: 'One team bringing the right expertise together for each client.' },
    { n: '03', t: 'Integrity', d: 'Honest advice and ethical conduct at every stage.' }
  ],

  sectors: ['Finance', 'Infrastructure', 'Transport', 'Technology', 'Innovation', 'Environmental', 'Life sciences', 'Healthcare', 'Corporate'],

  matters: ['Arbitration', 'Banking and finance', 'Competition', 'Construction and engineering', 'Environment', 'Electricity', 'Corporate', 'Employment and industrial laws', 'Fraud and financial crime', 'IP right disputes', 'Professional negligence', 'Real estate', 'Restructuring and insolvency', 'Trusts and probate', 'Matrimonial disputes'],

  roles: [
    { t: 'Advocates & Associates', d: 'Enrolled advocates with litigation or advisory experience.' },
    { t: 'Law Interns', d: 'Law students looking for hands-on exposure to practice.' },
    { t: 'Paralegals & Researchers', d: 'Support with research, drafting and documentation.' },
    { t: 'Office & Support Staff', d: 'Administration, accounts and client coordination.' }
  ],

  slides: [
    { img: 'About_B.jpg', eyebrow: 'Advocates & Legal Consultants · Pune', title: 'Legal and consultancy services in Pune.', text: 'Advice and representation for businesses and individuals in civil, criminal and commercial matters.', cta: 'View practice areas', area: null },
    { img: 'Corporate_B.jpg', eyebrow: 'Corporate and Commercial', title: 'Corporate and commercial matters.', text: 'Joint ventures, commercial agreements, governance and Competition Act matters.', cta: 'Read about this practice', area: 'corporate' },
    { img: 'Civil_B.jpg', eyebrow: 'Criminal & Civil Litigation', title: 'Civil and criminal litigation.', text: 'Matters before the High Court, District and Sessions Courts, consumer commissions and tribunals.', cta: 'Read about this practice', area: 'civil' },
    { img: 'Employment_B.jpg', eyebrow: 'Employment Laws', title: 'Employment and labour laws.', text: 'Compliance under the Labour Codes, policies, due diligence audits and matters before labour authorities.', cta: 'Read about this practice', area: 'employment' },
    { img: 'Information_B.jpg', eyebrow: 'Information Technology Laws', title: 'Information technology and data protection.', text: 'Cyber law, data protection, e-commerce and intellectual property in the digital space.', cta: 'Read about this practice', area: 'it' }
  ],

  areas: [
    { id: 'corporate', slug: 'corporate-commercial', img: 'Corporate_B.jpg', title: 'Corporate and Commercial', short: 'Joint ventures, commercial agreements, governance and the Competition Act, 2002.', paras: [
      { h: '', t: 'We advise on diverse aspects and related documentation including day-to-day corporate and commercial businesses, joint ventures, partnership deeds and commercial arrangements and agreements (agency, licensing, leasing, distribution, maintenance, sub-contracting, franchise, security etc.).' },
      { h: '', t: 'Governance and conduct have become increasingly important in the corporate and commercial world and the Competition Act, 2002 an important legislation. Our firm supports corporates in policy making, due diligence, drafting to accommodate the various requirements and litigation related to the Competition Act, 2002.' } ] },
    { id: 'civil', slug: 'criminal-civil-law', img: 'Civil_B.jpg', title: 'Criminal Law / Civil Law', short: 'Representation before the High Court, Sessions Courts, consumer fora and revenue authorities.', paras: [
      { h: 'Criminal Law', t: 'We represent clients in criminal proceedings under the Bharatiya Nyaya Sanhita, 2023 and the Bharatiya Nagarik Suraksha Sanhita, 2023 and under special statutes such as the Information Technology Act, 2000, the Copyright Act, 1957, the Trade Marks Act, 1999, environmental and pollution-control laws, the Labour Codes and the Negotiable Instruments Act, 1881 (including cheque dishonour cases), before the High Court, Sessions Courts and subordinate courts. Matters arising before 1 July 2024 continue to be handled under the Indian Penal Code and the Code of Criminal Procedure, as applicable.' },
      { h: 'Civil Law', t: 'We handle recovery suits, suits for specific performance, suits relating to commercial transactions and immovable property and suits for damages and compensation before the High Court, District Court and other subordinate courts. We represent clients before the District, State and National Consumer Disputes Redressal Commissions under the Consumer Protection Act, 2019, revenue authorities and other quasi-judicial authorities and advise on matrimonial and related disputes.' } ] },
    { id: 'real', slug: 'real-estate', img: 'Real_B.jpg', title: 'Real Estate', short: 'Transactions, documentation and disputes relating to immovable property.', paras: [
      { h: '', t: 'We advise on real estate transactions and related documentation and handle litigation and disputes relating to immovable property.' } ] },
    { id: 'succession', slug: 'succession-inheritance-law', img: 'Succession_B.jpg', title: 'Succession and Inheritance Laws', short: 'Wills, probate, succession certificates, partition, estate planning and NRI inheritance matters.', paras: [
      { h: '', t: 'We advise and represent clients in matters relating to succession, inheritance and estate administration under Indian law. Our practice covers testamentary and intestate succession, the rights of legal heirs and beneficiaries, probate proceedings, succession certificates and disputes relating to inherited and family-owned property. We assist individuals and families in understanding and enforcing their rights as heirs and beneficiaries, resolving inheritance disputes and ensuring the lawful devolution and transmission of assets.' },
      { h: 'Wills and estate planning', t: 'We advise on Wills, their execution, interpretation, validity and enforcement and on planning the succession and transmission of assets to intended beneficiaries, including through codicils, family settlements, gift deeds and private trusts.' },
      { h: 'Probate, Letters of Administration and succession certificates', t: 'We assist in obtaining probate of Wills and Letters of Administration and succession certificates in respect of debts and securities of deceased persons. We also assist with the transfer, transmission and mutation of inherited property following the death of an owner, including bank accounts, shares, revenue records and housing society records.' },
      { h: 'Partition, Will and estate disputes', t: 'We represent clients in disputes concerning ancestral and inherited property, partition and division of family assets and the validity, interpretation, execution or revocation of Wills, including disputes between legal heirs and nominees, before civil courts and the High Court. Where appropriate, we assist families in reaching settlements through mediation.' },
      { h: 'NRI inheritance matters', t: 'We assist non-resident Indians with inheritance and succession matters concerning property situated in India, including documentation, probate and succession proceedings and the transfer of inherited assets, acting through a power of attorney where the client is unable to be present in India.' } ] },
    { id: 'employment', slug: 'employment-law', img: 'Employment_B.jpg', title: 'Employment Laws & Due Diligence', short: 'Labour-law compliance, policies, union agreements and due diligence audits.', paras: [
      { h: '', t: 'Employment law in India is now governed largely by the four Labour Codes in force from 21 November 2025: the Code on Wages, 2019, the Industrial Relations Code, 2020, the Code on Social Security, 2020 and the Occupational Safety, Health and Working Conditions Code, 2020. We advise organisations on compliance under the Codes and the rules framed under them, drafting organisational policies and employment agreements, industrial relations and agreements with trade unions. We also represent managements in their dealings with unions.' },
      { h: '', t: 'We carry out due diligence audits under labour and employment laws and advise on practical steps for compliance. We also represent clients before labour authorities, tribunals and industrial and labour courts, including in matters that arose under the earlier labour statutes.' } ] },
    { id: 'adr', slug: 'alternative-dispute-resolution', img: 'Altarnet_B.jpg', title: 'Alternative Dispute Resolution', short: 'Arbitration and other routes to resolving disputes outside the courtroom.', paras: [
      { h: '', t: 'We advise and represent clients in arbitration under the Arbitration and Conciliation Act, 1996 and in mediation and other methods of resolving disputes outside court, including drafting dispute-resolution clauses and appearing in arbitral proceedings.' } ] },
    { id: 'it', slug: 'information-technology-law', img: 'Information_B.jpg', title: 'Information Technology Laws', short: 'Cyber law, data protection, e-commerce and protection against data theft.', paras: [
      { h: '', t: 'We advise clients on the Information Technology Act, 2000, cyber law, e-commerce and the protection of intellectual property online. We also advise on data protection under the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 and on preventing and responding to data theft.' },
      { h: '', t: 'We assist in drafting MOUs, non-disclosure agreements and other required drafts and represent clients in tribunals and courts in matters of IP infringement, contract and domain-name disputes, as well as cyber matters such as internet fraud, hacking, privacy and security.' } ] },
    { id: 'media', slug: 'media-broadcasting', img: 'Media_B.jpg', title: 'Media and Broadcasting', short: 'Contracts, compliance and disputes for media and broadcasting organisations.', paras: [
      { h: '', t: 'We advise media and broadcasting organisations on contracts, regulatory compliance and content-related disputes.' } ] },
    { id: 'ip', slug: 'intellectual-property', img: 'Intalactual_B.jpg', title: 'Intellectual Property Laws', short: 'Copyright, trade marks and enforcement of intellectual property rights.', paras: [
      { h: '', t: 'We advise on the protection and enforcement of intellectual property, including copyright and trade marks and represent clients in infringement disputes.' } ] },
    { id: 'ecology', slug: 'environment-law', img: 'Ecology_B.jpg', title: 'Ecology and Environment Laws', short: 'Environmental compliance and proceedings before the National Green Tribunal.', paras: [
      { h: '', t: 'We advise and represent clients under the Environment (Protection) Act, 1986, the Water and Air pollution-control Acts and related legislation, including matters before the National Green Tribunal.' } ] },
    { id: 'banking', slug: 'banking-finance-insurance', img: 'Banking_B.jpg', title: 'Banking, Finance and Insurance', short: 'Advisory and litigation support for banks, financial institutions and insurers.', paras: [
      { h: '', t: 'We provide advice, documentation and litigation support in banking, finance and insurance matters.' } ] },
    { id: 'research', slug: 'legal-research-opinion', img: 'Reasarch_B.jpg', title: 'Research and Legal Opinion', short: 'Researched, reasoned opinions on questions of law.', paras: [
      { h: '', t: 'We provide researched and reasoned legal opinions on questions of law across our areas of practice.' } ] }
  ]
};
