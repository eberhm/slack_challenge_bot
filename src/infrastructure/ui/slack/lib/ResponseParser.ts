// eslint-disable-next-line @typescript-eslint/ban-types
export const parseResponse = (values: Object) => {
    const result = Object
        .values(values)
        .reduce((prev, input) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const keyValPair = (Object.values(input)[0] as any);
                const type = keyValPair.type;
                let value;

                switch (type) {
                    case 'users_select':
                        console.log(keyValPair);
                        value = keyValPair.selected_user;
                        break;
                    case 'static_select':
                        console.log(keyValPair);
                        value = keyValPair.selected_option.value;
                        break;
                    default:
                        value = keyValPair.value;
                        break;
                }
                    
                prev[Object.keys(input)[0]] = value;
            
                return prev;
            }, {});

    return result;
};