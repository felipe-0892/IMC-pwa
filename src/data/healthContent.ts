import type { IMCCategory } from '../types/imc';

export interface HealthContent {
  /** Título do card de informações online. */
  headline: string;
  /** Frase curta que apresenta o tema. */
  intro: string;
  /** Temas abordados — sempre educativos, nunca prescritivos. */
  topics: string[];
}

export const HEALTH_CONTENT: Record<IMCCategory, HealthContent> = {
  baixo_peso: {
    headline: 'Ganho de peso saudável',
    intro: 'Confira informações sobre como ganhar peso de forma saudável, com foco na qualidade da alimentação.',
    topics: [
      'Refeições regulares com alimentos in natura e minimamente processados',
      'Ingestão adequada de nutrientes, incluindo fontes de proteína',
      'Treinamento de força para favorecer o ganho de massa muscular',
      'Acompanhamento nutricional para entender as causas do baixo peso',
      'Avaliação profissional quando houver perda de peso sem motivo aparente',
    ],
  },
  peso_normal: {
    headline: 'Manutenção de um peso saudável',
    intro: 'Confira informações sobre hábitos que ajudam a manter a saúde e o peso ao longo do tempo.',
    topics: [
      'Alimentação equilibrada e variada no dia a dia',
      'Atividade física regular, somando exercícios aeróbicos e de força',
      'Sono de qualidade e rotina de descanso',
      'Redução do tempo sentado e mais movimento na rotina',
      'Prevenção do ganho excessivo de peso ao longo da vida',
    ],
  },
  sobrepeso: {
    headline: 'Estratégias para uma perda de peso saudável',
    intro: 'Confira informações sobre estratégias de perda de peso gradual e sustentável, baseadas em evidências.',
    topics: [
      'Perda de peso gradual, sem métodos extremos',
      'Alimentação equilibrada e atenção à ingestão energética',
      'Atividade física regular e treinamento de força',
      'Hábitos sustentáveis: sono, rotina e comer com atenção',
      'Acompanhamento profissional quando necessário',
    ],
  },
  obesidade_grau_1: {
    headline: 'Tratamento da obesidade baseado em evidências',
    intro: 'Confira informações sobre como a obesidade é tratada, segundo diretrizes de saúde.',
    topics: [
      'Estratégias de perda de peso baseadas em evidências',
      'Alimentação equilibrada com orientação nutricional',
      'Atividade física e treinamento de força adequados a cada pessoa',
      'Acompanhamento médico e nutricional contínuo',
      'Tratamentos reconhecidos, discutidos com profissionais de saúde',
    ],
  },
  obesidade_grau_2: {
    headline: 'Tratamento da obesidade e mudanças sustentáveis',
    intro: 'Confira informações sobre o cuidado da obesidade e as opções que podem ser discutidas com profissionais.',
    topics: [
      'Mudanças de estilo de vida que se mantêm no longo prazo',
      'Atividade física adequada às condições de cada pessoa',
      'Acompanhamento médico e nutricional',
      'Opções terapêuticas que podem ser avaliadas por profissionais',
      'Cuidado de condições associadas, como pressão alta e diabetes',
    ],
  },
  obesidade_grau_3: {
    headline: 'Tratamento da obesidade grave',
    intro: 'Confira informações sobre o cuidado da obesidade grave e o papel do acompanhamento especializado.',
    topics: [
      'Acompanhamento médico e nutricional regular',
      'Atividade física adequada e orientada por profissionais',
      'Estratégias comportamentais e apoio psicológico',
      'Tratamentos médicos reconhecidos por diretrizes',
      'Possibilidade de avaliação por equipe especializada, inclusive no SUS',
    ],
  },
};
