import {
    Briefcase,
    UserCheck,
    User,
    FileHeart,
    Users,
    Gavel,
    TextSearch,
    BarChart2,
    Compass,
    Building2,
    Star,
} from "lucide-react";

const comingSoon = [
    {
        name: "🚧 Cargos e Faixa Salarial",
        description:
            "Pesquise cargos e salários atualizados para planejar sua carreira.",
        icon: <BarChart2 size={20} />,
        category: "Vagas",
    },
    {
        name: "🚧 Orientador de Carreiras",
        description:
            "Receba orientação com insights baseados no mercado e suas metas.",
        icon: <Compass size={20} />,
        category: "Carreira",
    },
    {
        name: "🚧 Fit de Cultura Corporativa",
        description:
            "Descubra empresas alinhadas aos seus valores e estilo de trabalho.",
        icon: <Building2 size={20} />,
        category: "Carreira",
    },
    {
        name: "🚧 Reputações de Empresas",
        description:
            "Analise a reputação das empresas com base em avaliações de funcionários.",
        icon: <Star size={20} />,
        category: "Carreira",
    },
];

export const modules = [
    {
        title: "Explorador de Vagas",
        url: "/dashboard/jobs",
        icon: Briefcase,
        category: "Busca de Vagas",
        description:
            "Explore oportunidades de trabalho com recursos avançados de filtragem e acesso direto às principais plataformas, facilitando a identificação das vagas mais alinhadas ao seu perfil.",
        shortDescription:
            "Encontre vagas ideais com filtros avançados e acesso direto às principais plataformas.",
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
        title: "Comparador de Candidatos",
        url: "/dashboard/candidate-comparator",
        icon: Users,
        category: "Comparação de Candidatos",
        description:
            "Realize análises estratégicas de currículos com base em uma vaga. Compare múltiplos candidatos e receba relatórios precisos para decisões mais eficazes.",
        shortDescription:
            "Compare candidatos de forma estratégica para decisões assertivas.",
    },
];
