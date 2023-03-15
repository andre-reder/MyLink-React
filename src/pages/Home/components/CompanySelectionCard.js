import PropTypes, { shape } from 'prop-types';
import Select from 'react-select';
import { CustomStyle } from '../../../components/CustomSelectStyle';

export default function CompanySelectionCard({
  setSelectedWorkplace,
  selectedWorkplace,
  workplaces,
}) {
  return (
    <>
      <div className="title">
        Por fim, selecione abaixo seu local de trabalho.
      </div>
      <Select
        value={
                {
                  value: selectedWorkplace.value,
                  label: selectedWorkplace.label,
                }
              }
        options={workplaces}
        onChange={(opt) => {
          setSelectedWorkplace({ value: opt.value, label: opt.label, address: opt.address });
        }}
        styles={CustomStyle}
        classNamePrefix="react-select"
        className="react-select-container"
      />
      {selectedWorkplace.address && (
        <div className="small">
          {selectedWorkplace.address}
        </div>
      )}
    </>
  );
}

CompanySelectionCard.propTypes = {
  setSelectedWorkplace: PropTypes.func.isRequired,
  selectedWorkplace: PropTypes.shape().isRequired,
  workplaces: PropTypes.arrayOf(shape()).isRequired,
};
