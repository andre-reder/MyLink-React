export const CustomStyle = {
//   container: (provided) => ({
//     ...provided,
//     background: 'none',
//   }),
//   input: (provided) => ({
//     ...provided,
//     background: 'none',
//   }),
//
  singleValue: (provided) => ({
    ...provided,
    background: 'none',
    color: 'inherit',
  }),
  //   groupHeading: (provided) => ({
  //     ...provided,
  //     background: 'none',
  //   }),
  //   group: (provided) => ({
  //     ...provided,
  //     background: 'none',
  //   }),
  //   clearIndicator: (provided) => ({
  //     ...provided,
  //     background: 'none',
  //   }),
  //   indicatorsContainer: (provided) => ({
  //     ...provided,
  //     background: 'none',
  //   }),
  menu: (provided) => ({
    ...provided,
  }),
  menuList: (provided) => ({
    ...provided,
    background: 'rgba(300, 300, 300, 0.8)',
  }),
  menuPortal: (provided) => ({
    ...provided,
    background: 'none',
  }),
  option: (provided, state) => ({
    ...provided,
    background: 'none',
    color: state.isSelected && '#000',
  }),
  valueContainer: (provided) => ({
    ...provided,
    background: 'transparent',
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    opacity: `${state.isDisabled ? '0.5' : '1'}`,
    cursor: `${state.isDisabled ? 'not-allowed' : 'default'}`,
  }),
  multiValue: (provided) => ({
    ...provided,
    background: 'unset',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'inherit',
  }),
};
