import type { I18nMessages, SupportedLanguage, SupportedTheme } from './types'
import { getThemeEmoji } from './themes'

// English (default)
const en: I18nMessages = {
  commitTypes: {
    feat: '🚀 Features',
    fix: '🐛 Bug Fixes',
    docs: '📚 Documentation',
    style: '💅 Styles',
    refactor: '♻️ Code Refactoring',
    perf: '⚡ Performance Improvements',
    test: '🧪 Tests',
    build: '📦 Build System',
    ci: '🤖 Continuous Integration',
    chore: '🧹 Chores',
    revert: '⏪ Reverts',
    misc: '📄 Miscellaneous',
  },
  labels: {
    changelog: 'Changelog',
    contributors: 'Contributors',
    breakingChanges: 'Breaking Changes',
    compareChanges: 'Compare changes',
    commits: 'commits',
    sections: 'sections',
    mostActive: 'Most active',
    newContributors: 'New contributors',
    topContributors: 'Top contributors',
    repositoryStats: 'Repository Statistics',
    commitFrequency: 'Commit Frequency',
    totalDays: 'Total days with commits',
    averagePerDay: 'Average commits per day',
    peakDay: 'Peak day',
    recentActivity: 'Recent activity',
    range: 'Range',
    totalCommits: 'Total commits',
    breakingChangesCount: 'Breaking changes',
    mostCommon: 'Most common',
    leastCommon: 'Least common',
    distribution: 'Distribution',
    by: 'by',
  },
  dateFormats: {
    full: 'MMMM d, yyyy',
    short: 'yyyy-MM-dd',
  },
}

// Spanish
const es: I18nMessages = {
  commitTypes: {
    feat: '🚀 Características',
    fix: '🐛 Correcciones',
    docs: '📚 Documentación',
    style: '💅 Estilos',
    refactor: '♻️ Refactorización',
    perf: '⚡ Mejoras de Rendimiento',
    test: '🧪 Pruebas',
    build: '📦 Sistema de Construcción',
    ci: '🤖 Integración Continua',
    chore: '🧹 Tareas',
    revert: '⏪ Reversiones',
    misc: '📄 Misceláneos',
  },
  labels: {
    changelog: 'Registro de Cambios',
    contributors: 'Colaboradores',
    breakingChanges: 'Cambios Importantes',
    compareChanges: 'Comparar cambios',
    commits: 'commits',
    sections: 'secciones',
    mostActive: 'Más activo',
    newContributors: 'Nuevos colaboradores',
    topContributors: 'Principales colaboradores',
    repositoryStats: 'Estadísticas del Repositorio',
    commitFrequency: 'Frecuencia de Commits',
    totalDays: 'Días totales con commits',
    averagePerDay: 'Promedio de commits por día',
    peakDay: 'Día pico',
    recentActivity: 'Actividad reciente',
    range: 'Rango',
    totalCommits: 'Total de commits',
    breakingChangesCount: 'Cambios importantes',
    mostCommon: 'Más común',
    leastCommon: 'Menos común',
    distribution: 'Distribución',
    by: 'por',
  },
  dateFormats: {
    full: 'd de MMMM de yyyy',
    short: 'dd/MM/yyyy',
  },
}

// French
const fr: I18nMessages = {
  commitTypes: {
    feat: '🚀 Fonctionnalités',
    fix: '🐛 Corrections',
    docs: '📚 Documentation',
    style: '💅 Styles',
    refactor: '♻️ Refactorisation',
    perf: '⚡ Améliorations de Performance',
    test: '🧪 Tests',
    build: '📦 Système de Build',
    ci: '🤖 Intégration Continue',
    chore: '🧹 Tâches',
    revert: '⏪ Annulations',
    misc: '📄 Divers',
  },
  labels: {
    changelog: 'Journal des Modifications',
    contributors: 'Contributeurs',
    breakingChanges: 'Changements Majeurs',
    compareChanges: 'Comparer les changements',
    commits: 'commits',
    sections: 'sections',
    mostActive: 'Le plus actif',
    newContributors: 'Nouveaux contributeurs',
    topContributors: 'Principaux contributeurs',
    repositoryStats: 'Statistiques du Dépôt',
    commitFrequency: 'Fréquence des Commits',
    totalDays: 'Jours totaux avec commits',
    averagePerDay: 'Moyenne de commits par jour',
    peakDay: 'Jour de pointe',
    recentActivity: 'Activité récente',
    range: 'Plage',
    totalCommits: 'Total des commits',
    breakingChangesCount: 'Changements majeurs',
    mostCommon: 'Le plus courant',
    leastCommon: 'Le moins courant',
    distribution: 'Distribution',
    by: 'par',
  },
  dateFormats: {
    full: 'd MMMM yyyy',
    short: 'dd/MM/yyyy',
  },
}

// German
const de: I18nMessages = {
  commitTypes: {
    feat: '🚀 Features',
    fix: '🐛 Fehlerbehebungen',
    docs: '📚 Dokumentation',
    style: '💅 Stile',
    refactor: '♻️ Code-Refactoring',
    perf: '⚡ Performance-Verbesserungen',
    test: '🧪 Tests',
    build: '📦 Build-System',
    ci: '🤖 Kontinuierliche Integration',
    chore: '🧹 Wartungsarbeiten',
    revert: '⏪ Rückgängigmachungen',
    misc: '📄 Verschiedenes',
  },
  labels: {
    changelog: 'Änderungsprotokoll',
    contributors: 'Mitwirkende',
    breakingChanges: 'Breaking Changes',
    compareChanges: 'Änderungen vergleichen',
    commits: 'Commits',
    sections: 'Abschnitte',
    mostActive: 'Aktivster',
    newContributors: 'Neue Mitwirkende',
    topContributors: 'Top-Mitwirkende',
    repositoryStats: 'Repository-Statistiken',
    commitFrequency: 'Commit-Häufigkeit',
    totalDays: 'Gesamttage mit Commits',
    averagePerDay: 'Durchschnittliche Commits pro Tag',
    peakDay: 'Spitzentag',
    recentActivity: 'Aktuelle Aktivität',
    range: 'Bereich',
    totalCommits: 'Gesamt-Commits',
    breakingChangesCount: 'Breaking Changes',
    mostCommon: 'Am häufigsten',
    leastCommon: 'Am seltensten',
    distribution: 'Verteilung',
    by: 'von',
  },
  dateFormats: {
    full: 'd. MMMM yyyy',
    short: 'dd.MM.yyyy',
  },
}

// Chinese (Simplified)
const zh: I18nMessages = {
  commitTypes: {
    feat: '🚀 新功能',
    fix: '🐛 错误修复',
    docs: '📚 文档',
    style: '💅 样式',
    refactor: '♻️ 代码重构',
    perf: '⚡ 性能优化',
    test: '🧪 测试',
    build: '📦 构建系统',
    ci: '🤖 持续集成',
    chore: '🧹 杂项',
    revert: '⏪ 回滚',
    misc: '📄 其他',
  },
  labels: {
    changelog: '更新日志',
    contributors: '贡献者',
    breakingChanges: '破坏性变更',
    compareChanges: '比较变更',
    commits: '提交',
    sections: '部分',
    mostActive: '最活跃',
    newContributors: '新贡献者',
    topContributors: '主要贡献者',
    repositoryStats: '仓库统计',
    commitFrequency: '提交频率',
    totalDays: '总提交天数',
    averagePerDay: '平均每日提交',
    peakDay: '峰值日',
    recentActivity: '最近活动',
    range: '范围',
    totalCommits: '总提交数',
    breakingChangesCount: '破坏性变更',
    mostCommon: '最常见',
    leastCommon: '最少见',
    distribution: '分布',
    by: '由',
  },
  dateFormats: {
    full: 'yyyy年M月d日',
    short: 'yyyy-MM-dd',
  },
}

// Japanese
const ja: I18nMessages = {
  commitTypes: {
    feat: '🚀 新機能',
    fix: '🐛 バグ修正',
    docs: '📚 ドキュメント',
    style: '💅 スタイル',
    refactor: '♻️ リファクタリング',
    perf: '⚡ パフォーマンス改善',
    test: '🧪 テスト',
    build: '📦 ビルドシステム',
    ci: '🤖 継続的インテグレーション',
    chore: '🧹 雑務',
    revert: '⏪ 巻き戻し',
    misc: '📄 その他',
  },
  labels: {
    changelog: '変更履歴',
    contributors: '貢献者',
    breakingChanges: '破壊的変更',
    compareChanges: '変更を比較',
    commits: 'コミット',
    sections: 'セクション',
    mostActive: '最もアクティブ',
    newContributors: '新しい貢献者',
    topContributors: '主要貢献者',
    repositoryStats: 'リポジトリ統計',
    commitFrequency: 'コミット頻度',
    totalDays: 'コミットした総日数',
    averagePerDay: '1日平均コミット数',
    peakDay: 'ピーク日',
    recentActivity: '最近の活動',
    range: '範囲',
    totalCommits: '総コミット数',
    breakingChangesCount: '破壊的変更',
    mostCommon: '最も一般的',
    leastCommon: '最も少ない',
    distribution: '分布',
    by: 'による',
  },
  dateFormats: {
    full: 'yyyy年M月d日',
    short: 'yyyy/MM/dd',
  },
}

// Korean
const ko: I18nMessages = {
  commitTypes: {
    feat: '🚀 새로운 기능',
    fix: '🐛 버그 수정',
    docs: '📚 문서',
    style: '💅 스타일',
    refactor: '♻️ 코드 리팩토링',
    perf: '⚡ 성능 개선',
    test: '🧪 테스트',
    build: '📦 빌드 시스템',
    ci: '🤖 지속적 통합',
    chore: '🧹 기타 작업',
    revert: '⏪ 되돌리기',
    misc: '📄 기타',
  },
  labels: {
    changelog: '변경 로그',
    contributors: '기여자',
    breakingChanges: '주요 변경사항',
    compareChanges: '변경사항 비교',
    commits: '커밋',
    sections: '섹션',
    mostActive: '가장 활발한',
    newContributors: '새로운 기여자',
    topContributors: '주요 기여자',
    repositoryStats: '저장소 통계',
    commitFrequency: '커밋 빈도',
    totalDays: '커밋한 총 일수',
    averagePerDay: '일평균 커밋 수',
    peakDay: '최고 활동일',
    recentActivity: '최근 활동',
    range: '범위',
    totalCommits: '총 커밋 수',
    breakingChangesCount: '주요 변경사항',
    mostCommon: '가장 일반적',
    leastCommon: '가장 적은',
    distribution: '분포',
    by: '작성자',
  },
  dateFormats: {
    full: 'yyyy년 M월 d일',
    short: 'yyyy-MM-dd',
  },
}

// Russian
const ru: I18nMessages = {
  commitTypes: {
    feat: '🚀 Новые возможности',
    fix: '🐛 Исправления ошибок',
    docs: '📚 Документация',
    style: '💅 Стили',
    refactor: '♻️ Рефакторинг кода',
    perf: '⚡ Улучшения производительности',
    test: '🧪 Тесты',
    build: '📦 Система сборки',
    ci: '🤖 Непрерывная интеграция',
    chore: '🧹 Прочие задачи',
    revert: '⏪ Откаты',
    misc: '📄 Разное',
  },
  labels: {
    changelog: 'История изменений',
    contributors: 'Участники',
    breakingChanges: 'Критические изменения',
    compareChanges: 'Сравнить изменения',
    commits: 'коммитов',
    sections: 'разделов',
    mostActive: 'Самый активный',
    newContributors: 'Новые участники',
    topContributors: 'Основные участники',
    repositoryStats: 'Статистика репозитория',
    commitFrequency: 'Частота коммитов',
    totalDays: 'Всего дней с коммитами',
    averagePerDay: 'Среднее коммитов в день',
    peakDay: 'Пиковый день',
    recentActivity: 'Недавняя активность',
    range: 'Диапазон',
    totalCommits: 'Всего коммитов',
    breakingChangesCount: 'Критические изменения',
    mostCommon: 'Наиболее частый',
    leastCommon: 'Наименее частый',
    distribution: 'Распределение',
    by: 'от',
  },
  dateFormats: {
    full: 'd MMMM yyyy г.',
    short: 'dd.MM.yyyy',
  },
}

// Portuguese
const pt: I18nMessages = {
  commitTypes: {
    feat: '🚀 Funcionalidades',
    fix: '🐛 Correções',
    docs: '📚 Documentação',
    style: '💅 Estilos',
    refactor: '♻️ Refatoração',
    perf: '⚡ Melhorias de Performance',
    test: '🧪 Testes',
    build: '📦 Sistema de Build',
    ci: '🤖 Integração Contínua',
    chore: '🧹 Tarefas',
    revert: '⏪ Reversões',
    misc: '📄 Diversos',
  },
  labels: {
    changelog: 'Registro de Alterações',
    contributors: 'Colaboradores',
    breakingChanges: 'Mudanças Importantes',
    compareChanges: 'Comparar alterações',
    commits: 'commits',
    sections: 'seções',
    mostActive: 'Mais ativo',
    newContributors: 'Novos colaboradores',
    topContributors: 'Principais colaboradores',
    repositoryStats: 'Estatísticas do Repositório',
    commitFrequency: 'Frequência de Commits',
    totalDays: 'Total de dias com commits',
    averagePerDay: 'Média de commits por dia',
    peakDay: 'Dia de pico',
    recentActivity: 'Atividade recente',
    range: 'Intervalo',
    totalCommits: 'Total de commits',
    breakingChangesCount: 'Mudanças importantes',
    mostCommon: 'Mais comum',
    leastCommon: 'Menos comum',
    distribution: 'Distribuição',
    by: 'por',
  },
  dateFormats: {
    full: 'd de MMMM de yyyy',
    short: 'dd/MM/yyyy',
  },
}

// Italian
const it: I18nMessages = {
  commitTypes: {
    feat: '🚀 Funzionalità',
    fix: '🐛 Correzioni',
    docs: '📚 Documentazione',
    style: '💅 Stili',
    refactor: '♻️ Refactoring',
    perf: '⚡ Miglioramenti delle Prestazioni',
    test: '🧪 Test',
    build: '📦 Sistema di Build',
    ci: '🤖 Integrazione Continua',
    chore: '🧹 Manutenzione',
    revert: '⏪ Rollback',
    misc: '📄 Varie',
  },
  labels: {
    changelog: 'Registro delle Modifiche',
    contributors: 'Collaboratori',
    breakingChanges: 'Modifiche Importanti',
    compareChanges: 'Confronta modifiche',
    commits: 'commit',
    sections: 'sezioni',
    mostActive: 'Più attivo',
    newContributors: 'Nuovi collaboratori',
    topContributors: 'Principali collaboratori',
    repositoryStats: 'Statistiche del Repository',
    commitFrequency: 'Frequenza dei Commit',
    totalDays: 'Giorni totali con commit',
    averagePerDay: 'Media commit al giorno',
    peakDay: 'Giorno di picco',
    recentActivity: 'Attività recente',
    range: 'Intervallo',
    totalCommits: 'Commit totali',
    breakingChangesCount: 'Modifiche importanti',
    mostCommon: 'Più comune',
    leastCommon: 'Meno comune',
    distribution: 'Distribuzione',
    by: 'da',
  },
  dateFormats: {
    full: 'd MMMM yyyy',
    short: 'dd/MM/yyyy',
  },
}

const translations: Record<SupportedLanguage, I18nMessages> = {
  en,
  es,
  fr,
  de,
  zh,
  ja,
  ko,
  ru,
  pt,
  it,
}

/**
 * Get translations for a specific language
 */
export function getTranslations(language: SupportedLanguage = 'en'): I18nMessages {
  return translations[language] || translations.en
}

/**
 * Get translated commit type format
 */
export function getCommitTypeFormat(language: SupportedLanguage = 'en'): Record<string, string> {
  return getTranslations(language).commitTypes
}

/**
 * Get translated label
 */
export function getLabel(key: keyof I18nMessages['labels'], language: SupportedLanguage = 'en'): string {
  return getTranslations(language).labels[key]
}

/**
 * Format date according to language locale
 */
export function formatDate(date: string | Date, language: SupportedLanguage = 'en', format: 'full' | 'short' = 'full'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (Number.isNaN(dateObj.getTime())) {
    return typeof date === 'string' ? date : ''
  }

  const locales: Record<SupportedLanguage, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    ru: 'ru-RU',
    pt: 'pt-BR',
    it: 'it-IT',
  }

  try {
    if (format === 'full') {
      return dateObj.toLocaleDateString(locales[language], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    else {
      return dateObj.toLocaleDateString(locales[language], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    }
  }
  catch {
    // Fallback to ISO string if locale formatting fails
    return dateObj.toISOString().split('T')[0]
  }
}

/**
 * Get all supported languages with their native names
 */
export function getSupportedLanguages(): Record<SupportedLanguage, string> {
  return {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    pt: 'Português',
    it: 'Italiano',
  }
}

/**
 * Get translated commit type format with theme emojis
 */
export function getCommitTypeFormatWithTheme(language: SupportedLanguage = 'en', theme: SupportedTheme = 'default'): Record<string, string> {
  const translations = getTranslations(language).commitTypes
  const result: Record<string, string> = {}

  for (const [type, text] of Object.entries(translations)) {
    const emoji = getThemeEmoji(type, theme)
    const cleanText = text.replace(/^[^\w\s]+\s*/, '') // Remove existing emojis
    result[type] = emoji ? `${emoji} ${cleanText}` : cleanText
  }

  return result
}

/**
 * Get commit type text without emoji
 */
export function getCommitTypeText(type: string, language: SupportedLanguage = 'en'): string {
  const translations = getTranslations(language).commitTypes
  const text = translations[type] || translations.misc || 'Miscellaneous'
  return text.replace(/^[^\w\s]+\s*/, '') // Remove existing emojis
}

/**
 * Get themed commit type format for a specific type
 */
export function getThemedCommitType(type: string, language: SupportedLanguage = 'en', theme: SupportedTheme = 'default'): string {
  const emoji = getThemeEmoji(type, theme)
  const text = getCommitTypeText(type, language)
  return emoji ? `${emoji} ${text}` : text
}
