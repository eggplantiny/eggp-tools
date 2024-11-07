import { LoadableButton } from '@/components/atomic/atoms/loadable-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PageRoot } from '@/components/ui/layout'
import { Separator } from '@/components/ui/separator'
import { useFont } from '@/hooks/use-font'
import usePageMeta from '@/hooks/use-page-meta'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function FontToSvgPage() {
  usePageMeta({
    title: 'Font to SVG',
  })

  const {
    setFontUrl,
    setFontFile,
    loading,
    isFetched,
    error,
    clear,
  } = useFont()

  const formSchema = z.object({
    url: z.string().url().optional(),
    file: z.any().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: undefined,
      file: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.url && !values.file) {
      return
    }

    if (values.url) {
      setFontUrl(values.url)
    }

    if (values.file) {
      setFontFile(values.file)
    }
  }

  return (
    <PageRoot className="flex flex-col gap-4">
      <Card
        className={cn('p-4 max-w-xl ml-auto')}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".otf,.ttf,.woff,.woff2"
                      onChange={e =>
                        field.onChange({ target: { value: e.target.files?.[0] ?? undefined, name: field.name } })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className={cn('my-4')}>
              or
            </Separator>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      {...field}
                      placeholder="https://example.com/font.ttf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={cn('mt-4 w-full flex flex-col gap-4')}>
              <LoadableButton
                block
                loading={loading}
                type="submit"
              >
                Submit
              </LoadableButton>

              <Button
                block
                type="button"
                variant="outline"
                onClick={() => {
                  clear()
                  form.reset()
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      {
        isFetched && (
          <Card className={cn('p-4 max-w-xl mx-auto')}>
            <p className={cn('text-green-500')}>Font fetched successfully</p>
          </Card>
        )
      }

      {error && (
        <Card className={cn('p-4 max-w-xl mx-auto')}>
          <p className={cn('text-red-500')}>{error}</p>
        </Card>
      )}
    </PageRoot>
  )
}
