export const replacePlaceHolder = (
  template: string,
  params: Record<string, string>,
) => {
  Object.keys(params).forEach((key) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), params[key]);
  });
  return template;
};
