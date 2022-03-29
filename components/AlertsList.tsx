/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { AlertsListProps } from "../additional";
import Alert from "./Alert";

const AlertsList = ({ alerts }: AlertsListProps) => {
	return (
		<div className="ml-4 max-w-max gap-2 md:grid">
			{alerts.map(a => (
				<Alert {...a} />
			))}
		</div>
	);
};

export default AlertsList;
