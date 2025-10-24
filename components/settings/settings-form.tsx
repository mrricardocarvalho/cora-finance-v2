/**
 * Settings Form Component
 *
 * Form for updating application settings (theme, default currency, AI).
 * Uses React Hook Form with Zod validation and tRPC mutations.
 *
 * @module components/settings/settings-form
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { trpc } from '@/lib/trpc/react';
import { updateSettingsSchema, type UpdateSettingsInput } from '@/lib/validations/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function SettingsForm() {
  const utils = trpc.useUtils();

  // Fetch settings and currencies
  const { data: settings, isLoading: loadingSettings } = trpc.settings.get.useQuery();
  const { data: currencies } = trpc.currencies.list.useQuery({ includeArchived: false });

  // Update settings mutation
  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success('Settings updated successfully');
      void utils.settings.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

  const form = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    values: settings
      ? {
          defaultCurrencyId: settings.defaultCurrencyId,
          theme: settings.theme,
          aiEnabled: settings.aiEnabled,
        }
      : undefined,
  });

  const onSubmit = (data: UpdateSettingsInput) => {
    updateMutation.mutate(data);
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-white/70">Settings not found. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Settings</CardTitle>
            <CardDescription>Set your default currency for new accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="defaultCurrencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Default Currency <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies?.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.code} - {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how Cora Finance looks</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Theme <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle>AI Features</CardTitle>
            <CardDescription>Enable AI-powered insights and automation</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="aiEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enable AI Features</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-sm text-white/70">
                        {field.value ? 'AI features enabled' : 'AI features disabled'}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
}
