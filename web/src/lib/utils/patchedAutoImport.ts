// @ts-nocheck
/**
 * Patch astro-auto-import@0.5.2, which hard-codes the deprecated
 * `updateConfig({ markdown: { remarkPlugins: [...] } })` API and triggers an
 * Astro deprecation warning. The wrapped hook swallows that legacy key and
 * re-injects the same remark plugin into the unified processor's options.
 */
import AutoImport from "astro-auto-import";

export default function patchedAutoImport(integrationConfig) {
  const base = AutoImport(integrationConfig);
  const setup = base.hooks["astro:config:setup"];

  return {
    ...base,
    hooks: {
      ...base.hooks,
      "astro:config:setup": (params) => {
        const { config, updateConfig } = params;
        let captured = null;

        const shimUpdateConfig = (newConfig) => {
          if (newConfig?.markdown?.remarkPlugins) {
            captured = newConfig.markdown.remarkPlugins;
            const markdown = { ...newConfig.markdown };
            delete markdown.remarkPlugins;
            newConfig = { ...newConfig, markdown };
          }
          return updateConfig(newConfig);
        };

        setup({ ...params, updateConfig: shimUpdateConfig });

        if (captured && config.markdown?.processor?.name === "unified") {
          config.markdown.processor.options.remarkPlugins.push(...captured);
        }
      },
    },
  };
}