import { AppContainer } from "@/components/layout/app-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section id="faq" className="py-16">
      <AppContainer>
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How is MarkStack different from Notion?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  MarkStack is specifically designed for developers and content
                  creators with built-in blog publishing, canvas integration,
                  and a focus on markdown-first workflows. While Notion is a
                  general-purpose productivity tool, MarkStack provides
                  specialized features like SEO-optimized blog deployment,
                  Excalidraw canvas integration, and developer-friendly markdown
                  editing with syntax highlighting.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Can I publish blogs publicly?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! MarkStack includes built-in blog publishing with SEO
                  optimization, custom domains, and analytics. You can publish
                  your content publicly and share it with your audience while
                  maintaining full control over your content.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  Absolutely. MarkStack uses industry-standard encryption for
                  data storage and transmission. Your content is stored securely
                  and backed up regularly. We also support self-hosting options
                  for organizations that require on-premises deployment.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                What integrations are available?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  MarkStack integrates with popular developer tools including
                  GitHub for version control, Excalidraw for visual diagrams,
                  and various CMS platforms for content distribution. We also
                  provide REST APIs and webhooks for custom integrations with
                  your existing workflow.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </AppContainer>
    </section>
  );
}
