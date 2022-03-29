/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { UploadGroupProps } from "../additional";

const UploadGroup = ({
	id,
	placeholder,
	fontSize,
	additionalProps,
}: UploadGroupProps) => (
	<div>
		<label className="sr-only" htmlFor={id}>
			{placeholder}
		</label>
		<input
			className={`placeholder:text-neutraccent-lime-500 block w-full border-b-2 border-solid border-neutral-300 p-2 leading-none ${fontSize} outline-none placeholder:transition focus:placeholder:opacity-0`}
			type="text"
			placeholder={placeholder}
			id={id}
			{...additionalProps}
		/>
	</div>
);

export default UploadGroup;
