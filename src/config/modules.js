import {
  Briefcase,
  UserCheck,
  User,
  FileHeart,
  MessageCircleQuestion,
  FileUser,
  Gavel,
  TextSearch,
  MessageSquareText,
} from "lucide-react";

export const modules = [
  {
    title: "Explorador de Vagas",
    url: "/dashboard/jobs",
    icon: Briefcase,
    category: "Busca de Vagas",
    description:
      "Explore oportunidades de trabalho com recursos avançados de filtragem e acesso direto às principais plataformas, facilitando a identificação das vagas mais alinhadas ao seu perfil.",
    shortDescription:
      "Encontre vagas ideais com filtros e acesso direto às principais plataformas.",
  },
  {
    title: "Analisador de Currículos",
    url: "/dashboard/cv-analyzer",
    icon: TextSearch,
    category: "Análise de Currículos",
    description:
      "Envie currículos para uma IA e receba insights estratégicos juntamente com descrições e pontuações assertivas para conhecer melhor o candidato, sua área de atuação e seu posicionamento no mercado de trabalho.",
    shortDescription:
      "Analise currículos com IA e descubra o perfil completo do candidato.",
  },
  {
    title: "Revisor de Currículos",
    url: "/dashboard/cv-reviewer",
    icon: Gavel,
    category: "Análise de Currículos",
    description:
      "Envie currículos para uma IA e receba insights estratégicos juntamente com descrições e pontuações assertivas para otimizá-lo, aumentando as chances de se destacar nas próximas oportunidades.",
    shortDescription:
      "Otimize currículos com IA para aumentar suas chances no mercado.",
  },
  {
    title: "Gerador de Perfis",
    url: "/dashboard/profile-generator",
    icon: UserCheck,
    category: "Criação de Perfis",
    description:
      "Crie perfis otimizados a partir de uma vaga, receba sugestões inteligentes de competências e habilidades, e analise candidatos com insights precisos para encontrar a combinação ideal para a sua necessidade.",
    shortDescription:
      "Crie perfis estratégicos com base em vagas e habilidades desejadas.",
  },
  {
    title: "Gerador de Linkedin",
    url: "/dashboard/linkedin-generator",
    icon: User,
    category: "Criação de Perfis",
    description:
      "Faça o upload de um currículo e transforme-o automaticamente em um perfil profissional, no estilo LinkedIn, pronto para maximizar oportunidades, altamente otimizado para os altos padrões do mercado.",
    shortDescription:
      "Transforme currículos em perfis LinkedIn prontos para impressionar.",
  },
  {
    title: "Match de Candidato x Vaga",
    url: "/dashboard/candidate-job-match",
    icon: FileHeart,
    category: "Análise de Aderência",
    description:
      "Realize análises estratégicas de currículos com base em vagas específicas. Receba relatórios profissionais que avaliam a aderência do candidato, destacam pontos fortes e oportunidades de melhoria, e ajudam a tomar decisões mais assertivas no recrutamento.",
    shortDescription:
      "Avalie o alinhamento entre currículos e vagas com inteligência.",
  },

  {
    title: "Criador de Currículos",
    url: "/dashboard/cv-builder",
    icon: FileUser,
    category: "Criação de Currículos",
    description:
      "Preencha um formulário simples com suas informações profissionais e o sistema gera automaticamente um currículo completo, bem formatado e pronto para download em PDF.",
    shortDescription:
      "Crie bons currículos aderentes a ATS a partir de um formulário simples e rápido.",
  },
  {
    title: "Simulador de Entrevistas",
    url: "/dashboard/interview-simulator",
    icon: MessageCircleQuestion,
    category: "Análise de Aderência",
    description:
      "Submeta um currículo e uma vaga para gerar um quiz de entrevista interativo. Responda perguntas baseadas no seu perfil e receba um score detalhado, com pontos fortes, GAPs de competência e recomendações de estudo para a vaga.",
    shortDescription:
      "Simule entrevistas reais com IA e receba feedback personalizado para sua preparação.",
  },
];
