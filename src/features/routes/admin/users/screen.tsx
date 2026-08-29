import { Badge } from '@/components/core/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/core/table';
import { getCurrentLocale } from '@/lib/i18n/server-locale';
import { getAdminUsersCopy } from './i18n';

export async function AdminUsersScreen() {
  const locale = await getCurrentLocale();
  const copy = getAdminUsersCopy(locale);

  return (
    <section className="space-y-6 p-5 md:p-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm text-ash">{copy.description}</p>
      </div>
      <Card className="border-gunmetal bg-obsidian">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest">
            {copy.cardTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {copy.users.map((user) => (
                <TableRow key={user.name} className="border-gunmetal/40">
                  <TableCell className="font-semibold text-titanium">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-ash">{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className="w-fit rounded-none border-vantor-blue/30 bg-vantor-blue/10 text-vantor-blue"
                      variant="none"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
