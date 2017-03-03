import Joi from 'joi';

export const Schema = Joi.object().keys({
  AnalysisScheme: Joi.object().required().keys({
    AnalysisSchemeLanguage: Joi.string().required().valid(
      'ar' , 'bg', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'eu', 'fa',
      'fi', 'fr', 'ga', 'gl', 'he', 'hi', 'hu', 'hy', 'id', 'it', 'ja',
      'ko', 'lv', 'mul', 'nl', 'no', 'pt', 'ro', 'ru',
      'sv', 'th', 'tr', 'zh-Hans', 'zh-Hant'
    ),
    AnalysisSchemeName: Joi.string().required().regex(/^[_a-z0-9]+$/, 'numbers, lowercase letters, underscores'),
    AnalysisOptions: Joi.object().keys({
      AlgorithmicStemming: Joi.string().valid(
        'none', 'minimal', 'light', 'full'
      ),
      JapaneseTokenizationDictionary: Joi.string(),
      StemmingDictionary: Joi.string(),
      Stopwords: Joi.string(),
      Synonyms: Joi.string()
    }),
  }),
  DomainName: Joi.string().required(),
});
