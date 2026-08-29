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
                    className="w-fit rounded-none border-tulpar-blue/30 bg-tulpar-blue/10 text-tulpar-blue"
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
  );
}
