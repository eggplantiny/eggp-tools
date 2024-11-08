import { LoadableButton } from '@/components/atomic/atoms/loadable-button'
import { HeightTransition } from '@/components/transitions/height-transition'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export interface FileUrlFormSubmitParams {
  url?: string
  file?: File
}

interface Props {
  loading?: boolean
  onSubmit: ({ url, file }: FileUrlFormSubmitParams) => Promise<void>
  urlPlaceholder?: string
  fileAccept?: string
}

export function FileUrlForm(props: Props) {
  const [open, setOpen] = useState<boolean>(true)

  const formSchema = z.object({
    url: z.string().url().optional(),
    file: z.any().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      file: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.url && !values.file) {
      return
    }

    await props.onSubmit({ url: values.url, file: values.file })
    setOpen(false)
  }

  function clear() {
    form.reset()
  }

  return (
    <>
      <HeightTransition isOpen={open}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
            <Separator className={cn('my-4')}>
              or
            </Separator>

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".otf,.ttf,.woff"
                      onChange={e =>
                        field.onChange({ target: { value: e.target.files?.[0] ?? undefined, name: field.name } })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={cn('mt-4 w-full flex flex-col gap-4')}>
              <LoadableButton
                block
                loading={props.loading ?? false}
                type="submit"
              >
                Load
              </LoadableButton>

              <Button
                block
                type="button"
                variant="outline"
                onClick={clear}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </HeightTransition>
      <HeightTransition isOpen={!open}>
        <Button
          block
          onClick={() => setOpen(true)}
        >
          Open
        </Button>
      </HeightTransition>
    </>

  )
}
