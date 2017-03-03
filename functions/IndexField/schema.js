import Joi from 'joi';

export const Schema = Joi.object().keys({
  DomainName: Joi.string().required(),
  IndexField: Joi.object().keys({
    IndexFieldName: Joi.string().required(),
    IndexFieldType: Joi.string().required().valid(
      'int', 'double', 'literal', 'text', 'date', 'latlon', 'int-array',
      'double-array', 'literal-array', 'text-array', 'date-array'
    ),
    DateArrayOptions: Joi.object().keys({
      DefaultValue: Joi.string(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceFields: Joi.string()
    }),
    DateOptions: Joi.object().keys({
      DefaultValue: Joi.string(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SortEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceField: Joi.string()
    }),
    DoubleArrayOptions: Joi.object().keys({
      DefaultValue: Joi.number(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceFields: Joi.string()
    }),
    DoubleOptions: Joi.object().keys({
      DefaultValue: Joi.number(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SortEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceField: Joi.string()
    }),
    IntArrayOptions: Joi.object().keys({
      DefaultValue: Joi.number().integer(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceFields: Joi.string()
    }),
    IntOptions: Joi.object().keys({
      DefaultValue: Joi.number().integer(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SortEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceField: Joi.string()
    }),
    LatLonOptions: Joi.object().keys({
      DefaultValue: Joi.string(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SortEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceField: Joi.string()
    }),
    LiteralArrayOptions: Joi.object().keys({
      DefaultValue: Joi.string(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceFields: Joi.string()
    }),
    LiteralOptions: Joi.object().keys({
      DefaultValue: Joi.string(),
      FacetEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SearchEnabled: Joi.boolean().truthy('true').falsy('false'),
      SortEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceField: Joi.string()
    }),
    TextArrayOptions: Joi.object().keys({
      AnalysisScheme: Joi.string(),
      DefaultValue: Joi.string(),
      HighlightEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceFields: Joi.string()
    }),
    TextOptions: Joi.object().keys({
      AnalysisScheme: Joi.string(),
      DefaultValue: Joi.string(),
      HighlightEnabled: Joi.boolean().truthy('true').falsy('false'),
      ReturnEnabled: Joi.boolean().truthy('true').falsy('false'),
      SortEnabled: Joi.boolean().truthy('true').falsy('false'),
      SourceField: Joi.string()
    }),
  })
});
